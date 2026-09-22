import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 my-16">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] flex items-center bg-stone-900">
        
        {/* Background Editorial Image */}
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=80"
          alt="Festive Offer Collection"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />

        {/* Gradient Overlay: Deep rich maroon into transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a0614]/95 via-[#5a1024]/80 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 max-w-xl px-8 sm:px-16 py-12 text-white flex flex-col items-start">
          
          {/* Coupon / Highlight Pill */}
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-amber-200">
            <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Festive Celebration Offer</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl font-serif font-black leading-tight tracking-wide drop-shadow-md">
            Flat 25% Off
            <span className="block text-amber-100 font-sans text-xl sm:text-2xl font-light mt-1">
              On All Handcrafted Silk Sets
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-stone-200 text-xs sm:text-sm mt-4 font-normal leading-relaxed max-w-md">
            Use code <strong className="text-white tracking-widest font-mono bg-white/20 px-2 py-0.5 rounded">FESTIVE25</strong> at checkout. Complimentary embroidered dupatta included with every order above ₹3,999.
          </p>

          {/* Call To Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/collections"
              className="px-7 py-3.5 bg-white text-[#5a1024] hover:bg-amber-100 text-xs font-black uppercase tracking-widest rounded transition-all duration-300 shadow-xl flex items-center space-x-2 group"
            >
              <span>Claim Discount</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <span className="text-[11px] text-stone-300 font-medium tracking-wider uppercase">
              *Valid till stocks last
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}