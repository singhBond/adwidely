import React from 'react';
import { Search, MapPin, LoaderPinwheel, Car, CheckSquare, ClipboardList, Megaphone, TrafficCone } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: "Slot Booking",
      description: "Lorem ipsum dolor sit amet elit edolore aliquaut enim nim veniam aliquip consequat",
      icon: <ClipboardList className="w-12 h-12 text-zinc-800" />,
    },
    {
      title: "Area Target",
      description: "Lorem ipsum dolor sit amet elit edolore aliquaut enim nim veniam aliquip consequat",
      icon: <div className="relative">
              {/* <CheckSquare className="w-6 h-6 absolute -top-2 -left-2 text-zinc-800" /> */}
              <TrafficCone  className="w-12 h-12 text-zinc-800" />
            </div>,
    },
    {
      title: "Advertisement",
      description: "Lorem ipsum dolor sit amet elit edolore aliquaut enim nim veniam aliquip consequat",
      icon: <Megaphone className="w-12 h-12 text-zinc-800" />,
    }
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-zinc-900">How It Works</h2>
          <div className="flex items-center justify-center gap-1">
            <div className="h-2px w-8 bg-zinc-300"></div>
            <div className="h-2px w-2 bg-zinc-300"></div>
            <div className="h-2px w-8 bg-zinc-300"></div>
          </div>
          <p className="text-zinc-400 text-sm uppercase tracking-widest">
            Simple steps to start
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Dashed Circle Container */}
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center mb-8 transition-colors group-hover:border-zinc-500">
                {step.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-zinc-800 mb-4">
                {step.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}