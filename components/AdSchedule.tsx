import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, MapPin, Clock } from "lucide-react";

const DRIVERS_DATA = [
  {
    name: "Ben Strokes",
    carImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=ben",
    route: "Downtown - Airport Express",
    ads: ["Luxury Watch Co.", "Local Bistro 30s"]
  },
  {
    name: "Shane Michael",
    carImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=shane",
    route: "Westside Tech Hub",
    ads: ["SaaS Launch Ad", "Summer Festival"]
  },
  {
    name: "John Matthew",
    carImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    avatar: "https://i.pravatar.cc/150?u=john",
    route: "University Loop",
    ads: ["Student Discounts", "Coffee Brand X"]
  }
];

export default function AdSchedule() {
  return (
    <section className="py-16 px-4 bg-[#f8fbfe] ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Today's Schedule</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Real-time tracking of our top-rated fleet. View today's active routes 
            and scheduled video advertisements playing across city screens.
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="h-2px w-8 bg-slate-300"></div>
            <div className="h[2px w-2 bg-slate-300"></div>
            <div className="h-2px w-8 bg-slate-300"></div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DRIVERS_DATA.map((driver, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white">
              {/* Vehicle Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={driver.carImage} 
                  alt={`${driver.name}'s vehicle`}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600">
                  Live Now
                </Badge>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Driver Identity */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={driver.avatar} />
                    <AvatarFallback>{driver.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xl font-bold text-slate-800">{driver.name}</span>
                </div>

                {/* Schedule Info */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-700">Today's Route</p>
                      <p className="text-slate-500">{driver.route}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <PlayCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-700">Ad Playlist</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {driver.ads.map((ad, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {ad}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 p-4 flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated 2m ago
                </div>
                <button className="text-blue-600 font-semibold hover:underline">
                  View Full Schedule
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}