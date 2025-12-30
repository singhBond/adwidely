"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  setDoc, // ← Added setDoc to create documents
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Play, Trash2, Check, X, ExternalLink, MessageCircle } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  businessName: string;
  phoneNumber: string;
  businessNumber?: string;
  videoUrl: string;
  month: string;
  slotNumber?: number;
  status: "pending_review" | "approved" | "rejected";
  createdAt: any;
}

interface LiveAd {
  videoUrl: string;
  clientName: string;
  businessName: string;
  slotNumber?: number;
  month: string;
  area?: string;
  playTime?: string;
  updatedAt?: any;
}

const getVideoEmbedUrl = (url: string): { embedUrl: string; isEmbeddable: boolean; isDirectVideo: boolean } => {
  try {
    const u = new URL(url.trim());
    const hostname = u.hostname.toLowerCase();

    if (hostname.includes("drive.google.com")) {
      const match = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return { embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`, isEmbeddable: true, isDirectVideo: false };
      }
    }

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      let videoId = "";
      if (hostname.includes("youtu.be")) videoId = u.pathname.slice(1).split("?")[0];
      else if (u.searchParams.has("v")) videoId = u.searchParams.get("v") || "";
      if (videoId) {
        return { embedUrl: `https://www.youtube.com/embed/${videoId}`, isEmbeddable: true, isDirectVideo: false };
      }
    }

    if (hostname.includes("vimeo.com")) {
      const match = u.pathname.match(/^\/(\d+)/);
      if (match) {
        return { embedUrl: `https://player.vimeo.com/video/${match[1]}`, isEmbeddable: true, isDirectVideo: false };
      }
    }

    const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];
    const isDirect = videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    return { embedUrl: url.trim(), isEmbeddable: false, isDirectVideo: isDirect };
  } catch {
    return { embedUrl: url.trim(), isEmbeddable: false, isDirectVideo: true };
  }
};

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Live Ad Schedule Fields
  const [liveAd, setLiveAd] = useState<LiveAd | null>(null);
  const [area, setArea] = useState("");
  const [playTime, setPlayTime] = useState("");

  // Fetch bookings
  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Booking[];
      setBookings(data);
      setFilteredBookings(data);
    });
    return () => unsub();
  }, []);

  // Fetch current live ad + schedule
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "liveAd", "current"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as LiveAd;
        setLiveAd(data);
        setArea(data.area || "");
        setPlayTime(data.playTime || "");
      } else {
        setLiveAd(null);
        setArea("");
        setPlayTime("");
      }
    });
    return () => unsub();
  }, []);

  // Safe search + filter
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((b) => {
        const searchable = [
          b.clientName?.toLowerCase() || "",
          b.businessName?.toLowerCase() || "",
          b.phoneNumber || "",
          b.month || "",
          b.slotNumber != null ? b.slotNumber.toString() : "",
          b.businessNumber?.toLowerCase() || "",
        ].join(" ");
        return searchable.includes(term);
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp.toDate()).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMonth = (month: string) =>
    new Date(`${month}-01`).toLocaleDateString("default", { month: "long", year: "numeric" });

  // Send WhatsApp message
  const sendWhatsAppMessage = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, "");
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, "_blank");
  };

  // Update live ad schedule
  const updateLiveAdSchedule = async () => {
    if (!area.trim() && !playTime.trim()) return;

    try {
      const liveAdDoc = doc(db, "liveAd", "current");
      await setDoc(liveAdDoc, {
        area: area.trim(),
        playTime: playTime.trim(),
        updatedAt: new Date(),
      }, { merge: true });

      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Error updating schedule");
    }
  };

  // Approve ad + send WhatsApp notification
  const approveAd = async (booking: Booking) => {
    if (!confirm(`Approve "${booking.businessName}" and set as LIVE ad?`)) return;

    const currentArea = area.trim() || "Main City Area";
    const currentTime = playTime.trim() || "10:00 AM - 8:00 PM";

    const message = `🎉 Congratulations ${booking.clientName}! 

Your ad for *${booking.businessName}* has been APPROVED and is now LIVE!

📍 *Today's Playing Location:* ${currentArea}
🕒 *Daily Play Time:* ${currentTime}
📅 *Month:* ${formatMonth(booking.month)}
🔢 *Slot:* ${booking.slotNumber || "N/A"}

Thank you for advertising with us! Your video is reaching thousands daily.

For any queries, reply here.`;

    setLoading(true);
    try {
      // Update booking status
      await updateDoc(doc(db, "bookings", booking.id), { status: "approved" });

      // Create or update liveAd with schedule (using setDoc with merge)
      const liveAdData: LiveAd = {
        videoUrl: booking.videoUrl,
        clientName: booking.clientName,
        businessName: booking.businessName,
        slotNumber: booking.slotNumber,
        month: booking.month,
        area: currentArea,
        playTime: currentTime,
        updatedAt: new Date(),
      };

      // Use setDoc with merge: true to create if doesn't exist, update if exists
      await setDoc(doc(db, "liveAd", "current"), liveAdData, { merge: true });

      // Send WhatsApp message
      sendWhatsAppMessage(booking.phoneNumber, message);

      alert("Ad approved, schedule updated, and WhatsApp message opened!");
    } catch (error) {
      console.error("Error approving ad:", error);
      alert("Error approving ad");
    }
    setLoading(false);
  };

  const rejectAd = async (id: string) => {
    if (!confirm("Reject this booking?")) return;
    try {
      await updateDoc(doc(db, "bookings", id), { status: "rejected" });
      alert("Booking rejected");
    } catch (error) {
      alert("Error rejecting");
    }
  };

  const deleteBooking = async (id: string, businessName: string) => {
    if (!confirm(`Permanently delete booking for "${businessName}"?`)) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      alert("Booking deleted permanently");
    } catch (error) {
      alert("Error deleting booking");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Admin Panel – Ad Slot Management
        </h1>

        {/* Daily Schedule Editor */}
        <Card className="mb-8 shadow-lg border-orange-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Today's Ad Play Schedule (Updates WhatsApp Message)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Area / Location</Label>
                <Input
                  placeholder="e.g., Downtown Mall, MG Road, City Center"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Play Time (Daily)</Label>
                <Input
                  placeholder="e.g., 10:00 AM - 8:00 PM"
                  value={playTime}
                  onChange={(e) => setPlayTime(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={updateLiveAdSchedule}
                  variant="outline"
                  className="w-full"
                  disabled={!area.trim() && !playTime.trim()}
                >
                  Update Schedule
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              This info will be sent to clients via WhatsApp when you approve their ad.
            </p>
            {liveAd && (
              <div className="text-sm text-green-600 p-3 bg-green-50 rounded-lg">
                ✅ Current Schedule: {liveAd.area} • {liveAd.playTime}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search by client, business, phone, month, slot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-slate-600 bg-slate-200 px-4 py-3 rounded-lg">
                  <strong>{filteredBookings.length}</strong> booking(s) shown
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.length === 0 ? (
            <p className="text-center text-slate-500 col-span-full py-12">
              {searchTerm || statusFilter !== "all"
                ? "No bookings match your search or filter."
                : "No bookings yet."}
            </p>
          ) : (
            filteredBookings.map((booking) => {
              const { embedUrl, isEmbeddable, isDirectVideo } = getVideoEmbedUrl(booking.videoUrl);

              return (
                <Card key={booking.id} className="shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.businessName}</CardTitle>
                        <p className="text-sm text-slate-600">by {booking.clientName}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-sm space-y-1">
                      <p><strong>Phone:</strong> {booking.phoneNumber}</p>
                      {booking.businessNumber && <p><strong>Business No:</strong> {booking.businessNumber}</p>}
                      <p><strong>Slot:</strong> {booking.slotNumber ?? "N/A"} — {formatMonth(booking.month)}</p>
                      <p><strong>Booked on:</strong> {formatDate(booking.createdAt)}</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Ad Video Preview</Label>
                      <div className="aspect-video rounded-lg overflow-hidden border bg-black shadow">
                        {isEmbeddable ? (
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`Preview for ${booking.businessName}`}
                          />
                        ) : (
                          <video src={embedUrl} controls className="w-full h-full object-contain" preload="metadata" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {isDirectVideo && (
                          <Button size="sm" variant="outline" className="flex-1"
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = booking.videoUrl;
                              a.download = `${booking.businessName.replace(/[^a-z0-9]/gi, '_')}_slot${booking.slotNumber || ''}.mp4`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        )}

                        <Button size="sm" variant="outline" className="flex-1"
                          onClick={() => window.open(booking.videoUrl, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" /> Open Original
                        </Button>

                        {!isEmbeddable && (
                          <Button size="sm" variant="outline" className="flex-1"
                            onClick={() => {
                              const video = document.querySelector(`video[src="${embedUrl}"]`) as HTMLVideoElement;
                              if (video) { video.currentTime = 0; video.play().catch(() => {}); }
                            }}>
                            <Play className="h-4 w-4 mr-2" /> Play
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {booking.status === "pending_review" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveAd(booking)}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve & Notify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectAd(booking.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => deleteBooking(booking.id, booking.businessName)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}