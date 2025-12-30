import React from 'react';
import { 
  ClipboardList, 
  Car, 
  CheckSquare, 
  LoaderPinwheel, 
  Gauge, 
  ShieldCheck, 
  Quote 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Helper component for the consistent section title with dash divider
const SectionTitle = ({ title, description }: { title: string; description?: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
    {description && <p className="text-slate-500 max-w-xl mx-auto mb-4 text-sm">{description}</p>}
    <div className="flex items-center justify-center gap-1">
      <div className="h-2px w-6 bg-slate-300"></div>
      <div className="h-2px w-2 bg-slate-300"></div>
      <div className="h-2px w-6 bg-slate-300"></div>
    </div>
  </div>
);

export default function ClientTestimonial() {
  return (
    <section className=" bg-white py-20 px-6 space-y-32">
       {/* Customer Reviews Section */}
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle title="Customer Reviews" />
        <div className="relative flex flex-col md:flex-row items-center justify-center">
          {/* Reviewer Image */}
          <div className="w-72 h-80 z-20 shrink-0 shadow-2xl overflow-hidden rounded-sm">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" className="w-full h-full object-cover" alt="Reviewer" />
          </div>
          {/* Quote Card */}
          <div className="bg-white p-12 md:p-16 md:-ml-12 shadow-xl border border-slate-50 relative z-10">
            <Quote className="w-12 h-12 text-blue-100 mb-6" />
            <p className="italic text-slate-600 text-lg leading-relaxed mb-8">
              "Norem ipsum dolor sit amet consectetur adipisicing elit quis nostrud exercita duis irure dolor rehenderit incidiun labore et dolore magna aliqua exercitation."
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2px w-6 bg-orange-500"></div>
              <span className="font-bold text-slate-800">Donald James</span>
            </div>
            {/* Carousel Dots */}
            <div className="flex gap-2 mt-8 md:absolute md:bottom-8 md:left-16">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <div className="h-2 w-2 rounded-full border border-slate-300"></div>
              <div className="h-2 w-2 rounded-full border border-slate-300"></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}