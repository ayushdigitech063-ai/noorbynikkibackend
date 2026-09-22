"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info & Newsletter (Takes 2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link 
              href="/" 
              className="text-3xl font-serif font-black tracking-[0.25em] text-white uppercase"
            >
              NOOR
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed mt-2">
              Curated ethnic couture crafted with handloom fabrics, delicate zari, and contemporary silhouettes for the modern festive wardrobe.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Join The Noor Society
              </span>
              <p className="text-[11px] text-stone-400 mb-3">
                Subscribe for secret festive drops & exclusive member discounts.
              </p>
              <form className="flex max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-stone-900 border border-stone-700 text-white text-xs px-4 py-2.5 rounded-l focus:outline-none focus:border-[#841934] w-full"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-[#841934] hover:bg-[#a01f3f] text-white px-4 py-2.5 rounded-r transition flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links: Shop */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Anarkali Sets
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Chanderi Kurtas
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Pure Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Sharara & Gharara
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition">
                  Festive Edit 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>care@noorbynikki.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>Jaipur, Rajasthan, India</span>
              </li>
              
              {/* Social Media Links */}
              <li className="pt-2 flex items-center space-x-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-stone-900 rounded-full hover:bg-[#841934] hover:text-white transition text-stone-400"
                >
                  
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-stone-900 rounded-full hover:bg-[#841934] hover:text-white transition text-stone-400"
                >
                 
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© 2026 Noor by Nikki. All rights reserved.</p>
          <div className="flex items-center space-x-4 uppercase font-mono tracking-wider text-[10px] text-stone-400">
            <span>UPI</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Net Banking</span>
          </div>
        </div>

      </div>
    </footer>
  );
}