// 'use client';

// import React, { useState, useEffect } from 'react';
// import { CalendarIcon, Search, CheckSquare, Loader2 } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { db } from "@/lib/firebase";
// import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import {  } from "@/lib/firebase"; // Make sure storage is exported in your firebase config

// // Helper to transform Google Drive share link to preview embed URL
// const getPreviewUrl = (inputUrl: string): string => {
//   try {
//     const url = new URL(inputUrl.trim());
//     if (url.hostname.includes('drive.google.com')) {
//       const match = url.pathname.match(/\/file\/d\/([^/]+)/);
//       if (match) {
//         const fileId = match[1];
//         return `https://drive.google.com/file/d/${fileId}/preview`;
//       }
//     }
//   } catch {
//     // Invalid URL
//   }
//   return inputUrl.trim();
// };

// export default function AdBooking() {
//   const [clientName, setClientName] = useState('');
//   const [businessName, setBusinessName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [businessNumber, setBusinessNumber] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [videoLink, setVideoLink] = useState('');
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
//   const [videoError, setVideoError] = useState('');
//   const [months, setMonths] = useState<string[]>([]);
//   const [bookedSlots, setBookedSlots] = useState<number>(0);
//   const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
//   const [bookingLoading, setBookingLoading] = useState(false);

//   // Generate next 12 months starting from January 2026 (current date: Dec 30, 2025)
//   useEffect(() => {
//     const currentDate = new Date(2025, 11, 30); // December 30, 2025
//     const monthOptions: string[] = [];
//     for (let i = 1; i <= 12; i++) {
//       const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
//       const monthStr = month.toISOString().slice(0, 7); // YYYY-MM
//       monthOptions.push(monthStr);
//     }
//     setMonths(monthOptions);
//     setSelectedMonth(monthOptions[0]);
//   }, []);

//   // Check availability when month changes
//   useEffect(() => {
//     if (selectedMonth) {
//       checkAvailability(selectedMonth);
//     }
//   }, [selectedMonth]);

//   const checkAvailability = async (month: string) => {
//     setIsCheckingAvailability(true);
//     setBookedSlots(0);
//     try {
//       const bookingsRef = collection(db, 'bookings');
//       const q = query(bookingsRef, where('month', '==', month));
//       const snapshot = await getDocs(q);
//       const count = snapshot.size;
//       setBookedSlots(count);
//     } catch (error) {
//       console.error("Error checking availability:", error);
//       setBookedSlots(0);
//     } finally {
//       setIsCheckingAvailability(false);
//     }
//   };

//   const formatMonth = (monthStr: string) => {
//     return new Date(`${monthStr}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
//   };

//   // Handle file upload (primary method)
//   const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setVideoLink(''); // Clear link when uploading file
//     setVideoPreviewUrl('');
//     setVideoError('');

//     if (!file) {
//       setVideoFile(null);
//       return;
//     }

//     if (file.type !== 'video/mp4') {
//       setVideoError('Only MP4 videos are allowed.');
//       return;
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       setVideoError('File size must be under 50MB.');
//       return;
//     }

//     const video = document.createElement('video');
//     video.preload = 'metadata';
//     video.onloadedmetadata = () => {
//       window.URL.revokeObjectURL(video.src);
//       if (video.duration > 30) {
//         setVideoError('Video must be 30 seconds or shorter.');
//         setVideoFile(null);
//       } else {
//         setVideoError('');
//         setVideoFile(file);
//         setVideoPreviewUrl(URL.createObjectURL(file));
//       }
//     };
//     video.onerror = () => {
//       setVideoError('Invalid video file.');
//     };
//     video.src = URL.createObjectURL(file);
//   };

//   // Handle video link input (secondary option)
//   const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const link = e.target.value;
//     setVideoLink(link);
//     setVideoFile(null); // Clear file if link is used
//     setVideoError('');

//     if (link.trim() === '') {
//       setVideoPreviewUrl('');
//       return;
//     }

//     const preview = getPreviewUrl(link);
//     setVideoPreviewUrl(preview);
//   };

//   const handleBookSlot = async () => {
//     if (!clientName || !businessName || !phoneNumber || !selectedMonth || (!videoFile && !videoLink.trim())) {
//       alert('Please fill all required fields and provide a video (upload preferred).');
//       return;
//     }

//     if (bookedSlots >= 5) {
//       alert('All slots are full for this month. Please select another month.');
//       return;
//     }

//     setBookingLoading(true);
//     try {
//       await checkAvailability(selectedMonth);
//       if (bookedSlots >= 5) {
//         alert('Sorry, this slot was just taken. Please choose another month.');
//         setBookingLoading(false);
//         return;
//       }

//       let finalVideoUrl = videoLink.trim();

//       if (videoFile) {
//         const videoRef = storageRef(storage, `ads/${Date.now()}_${videoFile.name}`);
//         await uploadBytes(videoRef, videoFile);
//         finalVideoUrl = await getDownloadURL(videoRef);
//       }

//       await addDoc(collection(db, 'bookings'), {
//         clientName,
//         businessName,
//         phoneNumber,
//         businessNumber: businessNumber || null,
//         month: selectedMonth,
//         videoUrl: finalVideoUrl,
//         createdAt: new Date(),
//         status: 'pending_review'
//       });

//       alert('Ad slot booked successfully! Your video is under review.');

//       if (videoFile) {
//         setVideoPreviewUrl(finalVideoUrl);
//       }

//       // Reset form
//       setClientName('');
//       setBusinessName('');
//       setPhoneNumber('');
//       setBusinessNumber('');
//       setVideoFile(null);
//       setVideoLink('');
//       setBookedSlots(prev => prev + 1);
//     } catch (error) {
//       console.error("Booking error:", error);
//       alert('Failed to book slot. Please try again.');
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const availableSlots = 5 - bookedSlots;
//   const isFull = bookedSlots >= 5;
//   const hasVideo = !!videoPreviewUrl;

//   return (
//     <div className="bg-gradient-to-b from-blue-50 to-white p-8 md:p-16 font-sans">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

//         {/* Left: Headline */}
//         <div className="lg:col-span-3 pt-10">
//           <h1 className="text-4xl font-semibold text-slate-900 mb-4">
//             Book your ad slot
//           </h1>
//           <p className="text-slate-600 text-lg leading-relaxed">
//             Reach thousands daily. Display your video on our fleet screens.
//           </p>
//         </div>

//         {/* Center: Form */}
//         <div className="lg:col-span-5">
//           <Card className="shadow-xl border-none">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
//               <CardTitle className="text-xl font-bold">Ad Slot Booking</CardTitle>
//               <Search className="h-5 w-5 text-slate-400 cursor-pointer" />
//             </CardHeader>
//             <CardContent className="space-y-6">

//               {/* Form Fields */}
//               <div className="grid grid-cols-3 items-center gap-4">
//                 <Label className="text-slate-700 font-medium">Client Name</Label>
//                 <Input className="col-span-2" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} />
//               </div>

//               <div className="grid grid-cols-3 items-center gap-4">
//                 <Label className="text-slate-700 font-medium">Business Name</Label>
//                 <Input className="col-span-2" placeholder="GetRider" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
//               </div>

//               <div className="grid grid-cols-3 items-center gap-4">
//                 <Label className="text-slate-700 font-medium">Phone Number</Label>
//                 <Input className="col-span-2" placeholder="+91 98765 43210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//               </div>

//               <div className="grid grid-cols-3 items-center gap-4">
//                 <Label className="text-slate-700 font-medium">Business Number <span className="font-normal text-slate-500">(Optional)</span></Label>
//                 <Input className="col-span-2" placeholder="GST / Udyam / PAN" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
//               </div>

//               {/* Month Selector */}
//               <div className="grid grid-cols-3 items-center gap-4">
//                 <Label className="text-slate-700 font-medium">Select Month</Label>
//                 <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                   <SelectTrigger className="col-span-2">
//                     <SelectValue placeholder="Choose a month" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {months.map((month) => (
//                       <SelectItem key={month} value={month}>
//                         {formatMonth(month)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Slot Visualization */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                   <CalendarIcon className="h-4 w-4" />
//                   Slot Availability for {formatMonth(selectedMonth)}
//                   {isCheckingAvailability && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
//                 </div>

//                 <div className="flex gap-3 items-center">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all
//                         ${i < bookedSlots 
//                           ? 'bg-orange-500 text-white border-orange-600' 
//                           : 'bg-white text-slate-400 border-slate-300'
//                         }
//                       `}
//                     >
//                       {i + 1}
//                     </div>
//                   ))}
//                 </div>

//                 <p className={`text-sm font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
//                   {isFull 
//                     ? 'All 5 slots are booked' 
//                     : `${availableSlots} of 5 slots available`
//                   }
//                 </p>
//               </div>

//               {/* Video Upload (Primary) */}
//               <div className="grid grid-cols-3 items-start gap-4">
//                 <Label className="text-slate-700 font-medium pt-2">Upload Video Ad <span className="text-red-500">*</span></Label>
//                 <div className="col-span-2 space-y-2">
//                   <Input type="file" accept="video/mp4" onChange={handleVideoFileChange} />
//                   {videoError && <p className="text-sm text-red-500">{videoError}</p>}
//                   <p className="text-xs text-slate-500">
//                     Max 30 seconds • MP4 only • Max 50MB
//                   </p>
//                   <p className="text-xs text-slate-600 mt-3">
//                     Or paste a link below (YouTube, Vimeo, Google Drive, or direct URL)
//                   </p>
//                   <Input 
//                     placeholder="Paste video link here..." 
//                     value={videoLink} 
//                     onChange={handleVideoLinkChange} 
//                   />
//                 </div>
//               </div>

//               {/* Booking Button */}
//               <div className="mt-8 p-6 bg-slate-100 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
//                 <div>
//                   <p className="text-lg font-bold text-slate-900">Price: $150/day</p>
//                   <p className="text-sm text-slate-600">Only 5 premium slots per month</p>
//                 </div>
//                 <Button
//                   size="lg"
//                   className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg"
//                   onClick={handleBookSlot}
//                   disabled={bookingLoading || isCheckingAvailability || isFull || !!videoError || (!videoFile && !videoLink.trim())}
//                 >
//                   {bookingLoading ? (
//                     <>Booking... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
//                   ) : (
//                     'Book Slot'
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right: Preview + Perks */}
//         <div className="lg:col-span-4 space-y-8">
//           <div className="text-right">
//             <a href="#" className="text-slate-700 font-semibold underline underline-offset-4 hover:text-blue-600">
//               More Popular Places →
//             </a>
//           </div>

//           {/* Video Preview */}
//           {hasVideo && (
//             <Card className="shadow-lg border-none max-w-sm ml-auto">
//               <CardContent className="p-6">
//                 <h3 className="font-bold text-slate-800 mb-4">Your Uploaded Video</h3>
//                 <div className="aspect-video relative rounded-lg overflow-hidden shadow-md bg-black">
//                   <iframe
//                     src={videoPreviewUrl}
//                     className="absolute inset-0 w-full h-full"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     title="Video Preview"
//                   ></iframe>
//                 </div>
//                 <p className="text-xs text-slate-500 mt-3 text-center">
//                   Will play on fleet screens after admin approval
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           {/* Why Advertise */}
//           <Card className="shadow-lg border-none max-w-sm ml-auto">
//             <CardContent className="p-6 space-y-4">
//               <h3 className="font-bold text-slate-800">Why Advertise with Us?</h3>
//               <ul className="space-y-3">
//                 {['Wide Reach', 'Targeted Audience', 'Affordable Rates'].map((item) => (
//                   <li key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                     <CheckSquare className="h-4 w-4 text-orange-500 fill-orange-50" />
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>

//           <div className="text-right">
//             <a href="#" className="text-slate-700 font-semibold underline underline-offset-4 hover:text-blue-600">
//               View Pricing Details →
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// YAHA SE ALAG CODE HAI




// "use client";

// import { useEffect, useState } from "react";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   where,
//   doc,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";

// interface Booking {
//   id: string;
//   slotNumber: number;
//   month: string;
//   videoUrl: string;
//   clientName: string;
//   status: string;
// }

// export default function AdBooking() {
//   const [clientName, setClientName] = useState("");
//   const [businessName, setBusinessName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [businessNumber, setBusinessNumber] = useState("");
  
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  
//   const [videoUrl, setVideoUrl] = useState("");
//   const [videoUrlError, setVideoUrlError] = useState("");
//   const [isVideoUrlValid, setIsVideoUrlValid] = useState(false);

//   const [months, setMonths] = useState<string[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [liveVideoUrl, setLiveVideoUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- Generate next 12 months starting from Jan 2026 ---------------- */
//   useEffect(() => {
//     const baseDate = new Date(2025, 11, 30); // Current date: Dec 30, 2025
//     const list: string[] = [];

//     for (let i = 1; i <= 12; i++) {
//       const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
//       list.push(d.toISOString().slice(0, 7));
//     }

//     setMonths(list);
//     if (list.length > 0) setSelectedMonth(list[0]);
//   }, []);

//   /* ---------------- Real-time booked slots ---------------- */
//   useEffect(() => {
//     if (!selectedMonth) return;

//     const q = query(
//       collection(db, "bookings"),
//       where("month", "==", selectedMonth)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         ...(d.data() as any),
//       }));
//       setBookings(data);
//     });

//     return () => unsub();
//   }, [selectedMonth]);

//   /* ---------------- Live playing ad ---------------- */
//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "liveAd", "current"), (snap) => {
//       if (snap.exists() && snap.data()?.videoUrl) {
//         setLiveVideoUrl(snap.data().videoUrl);
//       } else {
//         setLiveVideoUrl(null);
//       }
//     });

//     return () => unsub();
//   }, []);

//   const bookedSlots = bookings.map((b) => b.slotNumber);
//   const isSlotBooked = (slot: number) => bookedSlots.includes(slot);

//   const formatMonth = (m: string) =>
//     new Date(`${m}-01`).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });

//   /* ---------------- Video URL Validation & Normalization (real-time) ---------------- */
//   useEffect(() => {
//     if (videoUrl.trim() === "") {
//       setVideoUrlError("Video URL is required.");
//       setIsVideoUrlValid(false);
//       return;
//     }

//     try {
//       const urlObj = new URL(videoUrl.trim());
//       let normalized = videoUrl.trim();
//       let isValid = false;

//       // Support Google Drive share links
//       if (urlObj.hostname === "drive.google.com") {
//         const pathParts = urlObj.pathname.split("/");
//         const fileIndex = pathParts.indexOf("file");
//         if (fileIndex !== -1 && pathParts[fileIndex + 1] === "d") {
//           const fileId = pathParts[fileIndex + 2];
//           if (fileId) {
//             // Convert to direct playable link: https://drive.google.com/uc?id=FILE_ID
//             normalized = `https://drive.google.com/uc?id=${fileId}`;
//             isValid = true;
//           }
//         }
//       }
//       // Direct uc?id= format
//       else if (urlObj.hostname === "drive.google.com" && urlObj.searchParams.has("id")) {
//         isValid = true;
//       }
//       // Other supported direct video links
//       else {
//         const lower = normalized.toLowerCase();
//         if (
//           lower.endsWith(".mp4") ||
//           lower.endsWith(".webm") ||
//           lower.endsWith(".mov") ||
//           lower.includes("youtube.com") ||
//           lower.includes("youtu.be") ||
//           lower.includes("vimeo.com") ||
//           lower.includes("cloudinary.com")
//         ) {
//           isValid = true;
//         }
//       }

//       if (isValid) {
//         setVideoUrl(normalized); // Auto-normalize to direct link
//         setVideoUrlError("");
//         setIsVideoUrlValid(true);
//       } else {
//         setVideoUrlError("Please provide a valid direct video link (.mp4 preferred), YouTube/Vimeo URL, or Google Drive share link.");
//         setIsVideoUrlValid(false);
//       }
//     } catch (e) {
//       setVideoUrlError("Invalid URL format. Please check and try again.");
//       setIsVideoUrlValid(false);
//     }
//   }, [videoUrl]);

//   /* ---------------- Submit Booking ---------------- */
//   const handleSubmit = async () => {
//     if (!clientName.trim() || !businessName.trim() || !phoneNumber.trim() || selectedSlot === null) {
//       alert("Please fill all required fields and select a slot.");
//       return;
//     }

//     if (!isVideoUrlValid) {
//       alert("Please enter a valid video URL.");
//       return;
//     }

//     if (isSlotBooked(selectedSlot)) {
//       alert("This slot is already booked. Please choose another.");
//       return;
//     }

//     setLoading(true);

//     try {
//       await addDoc(collection(db, "bookings"), {
//         clientName: clientName.trim(),
//         businessName: businessName.trim(),
//         phoneNumber: phoneNumber.trim(),
//         businessNumber: businessNumber.trim() || null,
//         videoUrl: videoUrl.trim(), // Saved as direct playable link
//         month: selectedMonth,
//         slotNumber: selectedSlot,
//         status: "pending_review",
//         createdAt: new Date(),
//       });

//       alert(`Slot ${selectedSlot} booked successfully! Awaiting admin approval.`);

//       // Reset form
//       setClientName("");
//       setBusinessName("");
//       setPhoneNumber("");
//       setBusinessNumber("");
//       setSelectedSlot(null);
//       setVideoUrl("");
//     } catch (error) {
//       console.error("Booking error:", error);
//       alert("Failed to submit booking. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

//         {/* LEFT: Headline */}
//         <div className="lg:col-span-3 pt-12">
//           <h1 className="text-4xl font-bold text-slate-900 mb-6">Book Your Ad Slot</h1>
//           <p className="text-lg text-slate-600 leading-relaxed">
//             Reach thousands daily with your 30-second video ad on our premium display screens.
//           </p>
//         </div>

//         {/* CENTER: Booking Form */}
//         <div className="lg:col-span-5">
//           <Card className="shadow-2xl border-0">
//             <CardHeader>
//               <CardTitle className="text-2xl">Book Your Slot</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">

//               <InputField label="Client Name *" value={clientName} onChange={setClientName} />
//               <InputField label="Business Name *" value={businessName} onChange={setBusinessName} />
//               <InputField label="Phone Number *" value={phoneNumber} onChange={setPhoneNumber} placeholder="+91 98765 43210" />
//               <InputField label="Business Number (Optional)" value={businessNumber} onChange={setBusinessNumber} placeholder="GST / PAN / Udyam" />

//               {/* Month Selector */}
//               <div className="grid grid-cols-3 gap-4 items-center">
//                 <Label className="font-medium">Select Month</Label>
//                 <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                   <SelectTrigger className="col-span-2">
//                     <SelectValue placeholder="Choose month" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {months.map((m) => (
//                       <SelectItem key={m} value={m}>
//                         {formatMonth(m)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Slot Selection */}
//               <div className="space-y-3">
//                 <Label className="font-medium">Choose Your Slot</Label>
//                 <div className="grid grid-cols-5 gap-4">
//                   {[1, 2, 3, 4, 5].map((slot) => {
//                     const booked = isSlotBooked(slot);
//                     const selected = selectedSlot === slot;

//                     return (
//                       <Button
//                         key={slot}
//                         variant={booked ? "secondary" : selected ? "default" : "outline"}
//                         disabled={booked}
//                         onClick={() => setSelectedSlot(slot)}
//                         className="h-20 flex flex-col justify-center gap-1"
//                       >
//                         <span className="text-lg font-bold">Slot {slot}</span>
//                         {booked && <Badge variant="destructive" className="text-xs">Booked</Badge>}
//                         {selected && !booked && <Badge className="text-xs bg-orange-500">Selected</Badge>}
//                       </Button>
//                     );
//                   })}
//                 </div>
//                 <p className="text-sm text-slate-600">
//                   {5 - bookedSlots.length} of 5 slots available for {formatMonth(selectedMonth)}
//                 </p>
//               </div>

//               {/* Video URL Input */}
//               <div className="space-y-3">
//                 <Label className="font-medium">Video URL * (Direct Link or Google Drive Share Link)</Label>
//                 <Input
//                   type="url"
//                   placeholder="https://drive.google.com/file/d/.../view or https://example.com/video.mp4"
//                   value={videoUrl}
//                   onChange={(e) => setVideoUrl(e.target.value)}
//                   className="font-mono text-sm"
//                 />
//                 {videoUrlError && <p className="text-sm text-red-600 font-medium">{videoUrlError}</p>}
//                 {isVideoUrlValid && videoUrl && (
//                   <p className="text-sm text-green-600 font-medium">
//                     ✓ Valid URL – preview appearing on the right
//                   </p>
//                 )}
//                 <p className="text-xs text-slate-500">
//                   Supports direct MP4 links, YouTube, Vimeo, or Google Drive share links (must be set to "Anyone with the link").
//                 </p>
//               </div>

//               {/* Submit */}
//               <Button
//                 size="lg"
//                 className="w-full bg-orange-500 hover:bg-orange-600 font-bold text-lg py-6"
//                 onClick={handleSubmit}
//                 disabled={loading || !selectedSlot || !isVideoUrlValid}
//               >
//                 {loading ? "Submitting Booking..." : "Book This Slot Now – $150/month"}
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT: Live Ad + User Preview */}
//         <div className="lg:col-span-4 space-y-8">

//           {/* Currently Playing */}
//           <Card className="shadow-xl">
//             <CardHeader>
//               <CardTitle className="text-xl">Currently Playing Ad</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {liveVideoUrl ? (
//                 <video
//                   src={liveVideoUrl}
//                   controls
//                   className="w-full rounded-lg shadow-lg"
//                   autoPlay
//                   muted
//                   loop
//                 />
//               ) : (
//                 <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-slate-500">
//                   No ad currently playing
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Your Video Preview */}
//           {isVideoUrlValid && videoUrl && (
//             <Card className="shadow-xl border-2 border-orange-300">
//               <CardHeader>
//                 <CardTitle className="text-xl text-orange-700">
//                   Your Video Preview
//                 </CardTitle>
//                 <p className="text-sm text-slate-600">Will play after admin approval</p>
//               </CardHeader>
//               <CardContent>
//                 <video
//                   src={videoUrl}
//                   controls
//                   className="w-full rounded-lg shadow"
//                 />
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Reusable Input Component */
// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <div className="grid grid-cols-3 gap-4 items-center">
//       <Label className="font-medium text-slate-700">{label}</Label>
//       <Input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="col-span-2"
//       />
//     </div>
//   );
// }