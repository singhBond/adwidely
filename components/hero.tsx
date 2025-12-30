"use client";

import { Button } from "@/components/ui/button";
import {
  Menu,
  Phone,
  Car,
  Newspaper,
  HelpCircle,
  LoaderPinwheel,
  Megaphone,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const navItems = [
  { label: "Book Slot", icon: Car, href: "/AdBooking" },
  { label: "Offer a Ride", icon: LoaderPinwheel },
  { label: "News", icon: Newspaper },
  { label: "Help", icon: HelpCircle },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{
          backgroundImage:
            "url('https://www.leeman-led.com/wp-content/uploads/2022/10/610d0240edff3.webp')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2 text-3xl font-bold">
            <img src="/logo2.png" alt="logo" className="h-28 w-28" />
            {/* <Megaphone className="h-10 w-10 text-orange-500" /> */}
            {/* AdWidely */}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="/SlotBooking"
                className="flex items-center gap-2 text-white/90 hover:text-white transition"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
            {/* <a href="components/AdBooking">Book Slot</a> */}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:block">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              <Phone className="mr-2 h-4 w-4" />
              +345 700 8800
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white">
              <nav className="mt-10 flex flex-col gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className="flex items-center gap-3 text-lg"
                  >
                    <item.icon className="h-5 w-5 text-orange-500" />
                    {item.label}
                  </a>
                ))}
                <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
                  <Phone className="mr-2 h-4 w-4" />
                  +345 700 8800
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 text-center">
        <div className="max-w-3xl text-white">
          <p className="mb-4 text-md tracking-widest uppercase text-white/80">
            Advertise Your Business on the Largest Digital Billboard on wheels &
            Get more Leads or let world know about your business.
          </p>

          <h1 className="mb-8 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-5xl">
            {/* Need to Travel? <br /> */}
            Book a Slot for Advertising your Business on Fleet Screen on Wheels
          </h1>
          <Link href={"/SlotBooking"}>
            <Button
              variant="outline"
              className="border-white text-white bg-transparent px-10 py-6 text-lg hover:bg-white hover:text-black"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
