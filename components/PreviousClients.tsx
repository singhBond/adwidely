import React from 'react';
import { User, FolderOpen } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const CLIENT_WORKS = [
  {
    date: { month: "Jan", day: "17" },
    author: "Stephen Moya",
    category: "Car Hire",
    title: "Making car rentals easy for customers",
    description: "Incididunt ut laboret et dolore magna aliqua laboris nisialiquip ex loea Lorem ipsum dolor eiusmod tempor incididunt...",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop"
  },
  {
    date: { month: "Jan", day: "25" },
    author: "Stephen Moya",
    category: "Car Hire",
    title: "Enjoy your family trips with full happiness",
    description: "Incididunt ut laboret et dolore magna aliqua laboris nisialiquip ex loea Lorem ipsum dolor eiusmod tempor incididunt...",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop"
  },
  {
    date: { month: "Feb", day: "10" },
    author: "Stephen Moya",
    category: "Car Hire",
    title: "Quick hire with no-extra charges at all",
    description: "Incididunt ut laboret et dolore magna aliqua laboris nisialiquip ex loea Lorem ipsum dolor eiusmod tempor incididunt...",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop"
  }
];

export default function PreviousClient() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Optional Header if used standalone */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-zinc-900">Or Recent Client & Works</h2>
          <div className="flex items-center justify-center gap-1">
            <div className="h-2px w-8 bg-zinc-300"></div>
            <div className="h-2px w-2 bg-zinc-300"></div>
            <div className="h-2px w-8 bg-zinc-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLIENT_WORKS.map((work, index) => (
            <Card key={index} className="border-none shadow-none group">
              {/* Image Container with Date Badge */}
              <div className="relative h-64 w-full overflow-hidden rounded-sm mb-6">
                <img 
                  src={work.image} 
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlapping Date Badge */}
                <div className="absolute bottom-4 left-4 bg-orange-500 text-white w-14 h-16 flex flex-col items-center justify-center rounded-sm shadow-lg">
                  <span className="text-xs uppercase font-medium">{work.date.month}</span>
                  <span className="text-xl font-bold leading-none">{work.date.day}</span>
                </div>
              </div>

              <CardContent className="p-0 space-y-4">
                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {work.author}
                  </div>
                  <div className="h-3 w-1px bg-zinc-300"></div>
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {work.category}
                  </div>
                </div>

                <div className="h-2px w-full bg-zinc-100"></div>

                {/* Text Content */}
                <h3 className="text-xl font-extrabold text-zinc-900 leading-tight group-hover:text-orange-500 transition-colors">
                  {work.title}
                </h3>
                
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                  {work.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}