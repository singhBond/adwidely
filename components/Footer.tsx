import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Rss } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: "#" },
    { icon: <Facebook className="w-4 h-4" />, href: "#" },
    { icon: <Instagram className="w-4 h-4" />, href: "#" },
    { icon: <Youtube className="w-4 h-4" />, href: "#" },
    { icon: <Rss className="w-4 h-4" />, href: "#" },
  ];

  return (
    <footer className="relative bg-[#111111] text-white pt-1 pb-10 overflow-hidden">
      {/* 1. Checkered Top Border */}
      <div 
        className="absolute top-0 left-0 w-full h-4 opacity-80" 
        style={{
          backgroundImage: `repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)`,
          backgroundSize: '16px 16px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mt-20 flex flex-col items-center text-center">
        
        {/* 2. Logo Section */}
        <div className="flex items-center gap-2 mb-8 group cursor-pointer">
          <div className="relative flex items-center justify-center">
             {/* Pin-style logo icon */}
             <div className="w-10 h-10 bg-orange-500 rounded-t-full rounded-bl-full rotate-45 flex items-center justify-center shadow-lg group-hover:bg-orange-600 transition-colors">
                <div className="w-6 h-6 border-4 border-white rounded-full -rotate-45 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
             </div>
          </div>
          <span className="text-4xl font-black tracking-tighter">
   AdWidely
          </span>
        </div>

        {/* 3. Description Text */}
        <p className="max-w-2xl text-zinc-400 text-sm leading-relaxed mb-10">
          Eorem ipsum dolor sit amet consectetur adipisicing elit edolore magna 
          aliqua ut enim ad minim veniam quis aliquip consequat
        </p>

        {/* 4. Social Icons Row */}
        <div className="flex items-center gap-3 mb-12">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500 transition-all duration-300 bg-transparent hover:scale-110"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* 5. Copyright */}
        <div className="pt-8 border-t border-zinc-800 w-full max-w-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
            (C) 2021 ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}