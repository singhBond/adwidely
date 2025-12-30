



"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  slotNumber: number;
  month: string;
  videoUrl: string;
  clientName: string;
  status: string;
}

export default function AdBooking() {
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUrlError, setVideoUrlError] = useState("");
  const [isVideoUrlValid, setIsVideoUrlValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(""); // For iframe or video src

  const [months, setMonths] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [liveVideoUrl, setLiveVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Generate next 12 months starting from Jan 2026 ---------------- */
  useEffect(() => {
    const baseDate = new Date(2025, 11, 30); // Dec 30, 2025
    const list: string[] = [];

    for (let i = 1; i <= 12; i++) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
      list.push(d.toISOString().slice(0, 7));
    }

    setMonths(list);
    if (list.length > 0) setSelectedMonth(list[0]);
  }, []);

  /* ---------------- Real-time booked slots ---------------- */
  useEffect(() => {
    if (!selectedMonth) return;

    const q = query(
      collection(db, "bookings"),
      where("month", "==", selectedMonth)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setBookings(data);
    });

    return () => unsub();
  }, [selectedMonth]);

  /* ---------------- Live playing ad ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "liveAd", "current"), (snap) => {
      if (snap.exists() && snap.data()?.videoUrl) {
        setLiveVideoUrl(snap.data().videoUrl);
      } else {
        setLiveVideoUrl(null);
      }
    });

    return () => unsub();
  }, []);

  const bookedSlots = bookings.map((b) => b.slotNumber);
  const isSlotBooked = (slot: number) => bookedSlots.includes(slot);

  const formatMonth = (m: string) =>
    new Date(`${m}-01`).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

  /* ---------------- Generate Preview URL (for iframe/video) ---------------- */
  const generatePreviewUrl = (url: string): string => {
    try {
      const u = new URL(url.trim());
      const hostname = u.hostname.toLowerCase();

      // Google Drive: convert share link to preview embed
      if (hostname.includes("drive.google.com")) {
        const match = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
          const fileId = match[1];
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }

      // YouTube
      if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
        let videoId = "";
        if (hostname.includes("youtu.be")) {
          videoId = u.pathname.slice(1);
        } else if (u.searchParams.has("v")) {
          videoId = u.searchParams.get("v") || "";
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Vimeo
      if (hostname.includes("vimeo.com")) {
        const match = u.pathname.match(/\/(\d+)/);
        if (match) {
          return `https://player.vimeo.com/video/${match[1]}`;
        }
      }

      // Direct video file (MP4, etc.) – use as-is
      return url.trim();
    } catch {
      return url.trim();
    }
  };

  /* ---------------- Video URL Validation & Preview Setup ---------------- */
  useEffect(() => {
    if (videoUrl.trim() === "") {
      setVideoUrlError("Video URL is required.");
      setIsVideoUrlValid(false);
      setPreviewUrl("");
      return;
    }

    try {
      const urlObj = new URL(videoUrl.trim());
      let isValid = false;

      const lower = videoUrl.toLowerCase();

      if (
        lower.includes("youtube.com") ||
        lower.includes("youtu.be") ||
        lower.includes("vimeo.com") ||
        lower.includes("drive.google.com") ||
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".mov")
      ) {
        isValid = true;
      }

      if (isValid) {
        setVideoUrlError("");
        setIsVideoUrlValid(true);
        setPreviewUrl(generatePreviewUrl(videoUrl));
      } else {
        setVideoUrlError("Unsupported URL. Please use YouTube, Vimeo, Google Drive share link, or direct .mp4 link.");
        setIsVideoUrlValid(false);
        setPreviewUrl("");
      }
    } catch (e) {
      setVideoUrlError("Invalid URL format.");
      setIsVideoUrlValid(false);
      setPreviewUrl("");
    }
  }, [videoUrl]);

  /* ---------------- Submit Booking ---------------- */
  const handleSubmit = async () => {
    if (!clientName.trim() || !businessName.trim() || !phoneNumber.trim() || selectedSlot === null) {
      alert("Please fill all required fields and select a slot.");
      return;
    }

    if (!isVideoUrlValid) {
      alert("Please enter a valid video URL.");
      return;
    }

    if (isSlotBooked(selectedSlot)) {
      alert("This slot is already booked. Please choose another.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        clientName: clientName.trim(),
        businessName: businessName.trim(),
        phoneNumber: phoneNumber.trim(),
        businessNumber: businessNumber.trim() || null,
        videoUrl: videoUrl.trim(), // Store original or direct link
        month: selectedMonth,
        slotNumber: selectedSlot,
        status: "pending_review",
        createdAt: new Date(),
      });

      alert(`Slot ${selectedSlot} booked successfully! Awaiting admin approval.`);

      // Reset form
      setClientName("");
      setBusinessName("");
      setPhoneNumber("");
      setBusinessNumber("");
      setSelectedSlot(null);
      setVideoUrl("");
      setPreviewUrl("");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit booking. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* LEFT: Headline */}
        <div className="lg:col-span-3 pt-12 space-y-6">
  <h1 className="text-4xl font-bold text-slate-900">
    Book your ad slot
  </h1>

  <p className="text-lg text-slate-600 leading-relaxed">
    Reach thousands daily with your 30-second video advertisement displayed on our
    premium digital screens across high-traffic locations.
  </p>

  {/* Advertisement Plans */}
  <div className="mt-8 space-y-4">
    <h2 className="text-xl font-semibold text-slate-800">
      Advertisement plans
    </h2>

    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <div>
          <p className="font-semibold text-slate-800">Weekly plan</p>
          <p className="text-sm text-slate-500">7 days continuous display</p>
        </div>
        <span className="text-lg font-bold text-orange-600">
          ₹4,999/-
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <div>
          <p className="font-semibold text-slate-800">Monthly plan</p>
          <p className="text-sm text-slate-500">30 days continuous display</p>
        </div>
        <span className="text-lg font-bold text-orange-600">
          ₹19,999/-
        </span>
      </div>
    </div>

    <p className="text-xs text-slate-500 pt-2">
      * All plans include content review and admin approval before going live.
    </p>
  </div>
</div>


        {/* CENTER: Booking Form */}
        <div className="lg:col-span-5">
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <InputField label="Client Name *" value={clientName} onChange={setClientName} />
              <InputField label="Business Name *" value={businessName} onChange={setBusinessName} />
              <InputField label="Phone Number *" value={phoneNumber} onChange={setPhoneNumber} placeholder="+91 98765 43210" />
              <InputField label="Business Number (Optional)" value={businessNumber} onChange={setBusinessNumber} placeholder="GST / PAN / Udyam" />

              {/* Month Selector */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <Label className="font-medium">Select Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Choose month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {formatMonth(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Slot Selection */}
              <div className="space-y-3">
                <Label className="font-medium">Choose Your Slot</Label>
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((slot) => {
                    const booked = isSlotBooked(slot);
                    const selected = selectedSlot === slot;

                    return (
                      <Button
                        key={slot}
                        variant={booked ? "secondary" : selected ? "default" : "outline"}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        className="h-20 flex flex-col justify-center gap-1"
                      >
                        <span className="text-lg font-bold">Slot {slot}</span>
                        {booked && <Badge variant="destructive" className="text-xs">Booked</Badge>}
                        {selected && !booked && <Badge className="text-xs bg-orange-500">Selected</Badge>}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-600">
                  {5 - bookedSlots.length} of 5 slots available for {formatMonth(selectedMonth)}
                </p>
              </div>

              {/* Video URL Input */}
              <div className="space-y-3">
                <Label className="font-medium">Video URL * (YouTube, Vimeo, Google Drive, or Direct MP4)</Label>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view or https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                {videoUrlError && <p className="text-sm text-red-600 font-medium">{videoUrlError}</p>}
                {isVideoUrlValid && videoUrl && (
                  <p className="text-sm text-green-600 font-medium">
                    Valid URL – preview appearing on the right
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Supports YouTube, Vimeo, Google Drive share links (set to "Anyone with link"), or direct .mp4 files.
                </p>
              </div>

              {/* Submit */}
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 font-bold text-lg py-6"
                onClick={handleSubmit}
                disabled={loading || !selectedSlot || !isVideoUrlValid}
              >
                {loading ? "Submitting Booking..." : "Book This Slot Now – $150/month"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Live Ad + User Preview */}
        <div className="lg:col-span-4 space-y-8">

          {/* Currently Playing */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Currently Playing Ad</CardTitle>
            </CardHeader>
            <CardContent>
              {liveVideoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe
                    src={generatePreviewUrl(liveVideoUrl)}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="Currently Playing"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-slate-500">
                  No ad currently playing
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Video Preview */}
          {isVideoUrlValid && previewUrl && (
            <Card className="shadow-xl border-2 border-orange-300">
              <CardHeader>
                <CardTitle className="text-xl text-orange-700">
                  Your Video Preview
                </CardTitle>
                <p className="text-sm text-slate-600">Will play after admin approval</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden shadow bg-black">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Your Video Preview"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <Label className="font-medium text-slate-700">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="col-span-2"
      />
    </div>
  );
}