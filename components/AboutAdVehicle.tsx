import React from 'react';
import { Car, Gauge, MonitorPlay, RotateCcw, ShieldCheck, TrafficCone } from 'lucide-react';

const FEATURES = [
  {
  title: "Millions of daily impressions",
  description:
    "Your video advertisement is displayed continuously across our moving fleet, generating millions of daily impressions as vehicles travel through high-traffic urban routes.",
  icon: <TrafficCone className="w-8 h-8 text-zinc-800" />,
},
{
  title: "3-side digital display vehicles",
  description:
    "Each advertising vehicle is equipped with three high-resolution LED screens on multiple sides, ensuring maximum visibility from every angle, day and night.",
  icon: <MonitorPlay  className="w-8 h-8 text-zinc-800" />,
},
{
  title: "Continuous video playback",
  description:
    "Your 30-second video ad runs in a continuous loop on premium display screens, delivering consistent brand exposure throughout the entire journey.",
  icon: <RotateCcw className="w-8 h-8 text-zinc-800" />,
}

];

export default function AboutAdVehicle() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Information */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-zinc-900">About Advertisement Vehicle</h2>
              <div className="flex items-center gap-1">
                <div className="h-2px w-8 bg-zinc-300"></div>
                <div className="h-2px w-2 bg-zinc-300"></div>
                <div className="h-2pxw-4 bg-zinc-300"></div>
              </div>
            </div>

            <div className="space-y-12">
              {FEATURES.map((feature, index) => (
                <div key={index} className="flex gap-6 group">
                  {/* Dashed Icon Container */}
                  <div className="shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center transition-colors group-hover:border-zinc-400">
                    {feature.icon}
                  </div>
                  
                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-800">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed max-w-md">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Branded Vehicle Image */}
          <div className="relative lg:translate-x-12">
            <img 
              src="https://5.imimg.com/data5/SELLER/Default/2023/7/326814036/BW/XA/RB/24641389/advertising-vehicle-display-board.png" 
              alt="GetRider Branded Advertisement Vehicle"
              className="w-full h-auto drop-shadow-2xl object-contain"
            />
            {/* Branding Overlay (Mockup for the logo seen in the image) */}
            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 opacity-80 pointer-events-none">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-2 rounded">
                   {/* <div className="w-6 h-6 rounded-full bg-orange-500" /> */}
                   {/* <span className="font-black text-2xl tracking-tighter text-zinc-900">GetRider</span> */}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}