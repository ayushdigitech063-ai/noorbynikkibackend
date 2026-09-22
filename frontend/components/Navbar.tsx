import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Top promotional bar */}
      {/* <div className="bg-rose-900 text-white text-xs py-2 text-center tracking-wide font-medium">
        Free Shipping on Orders Above ₹1,999 | Use Code: FESTIVE
      </div> */}

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
  href="/" 
  className="text-3xl font-serif font-black tracking-[0.25em] text-black !text-black"
  style={{ color: "#000000" }}
>
  NOOR
</Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-800 uppercase tracking-wide">
          <Link href="/" className="hover:text-rose-900 transition">Home</Link>
          <Link href="/products" className="hover:text-rose-900 transition">All Colections</Link>
          <Link href="/products" className="hover:text-rose-900 transition">New Latest</Link>
          <Link href="/products" className="hover:text-rose-900 transition">Bright</Link>
          <Link href="/products" className="hover:text-rose-900 transition">Contact</Link>

        </nav>

        <div className="flex items-center space-x-5 text-gray-700">
          {/* Search Button */}
          <button 
            aria-label="Search" 
            className="p-1 hover:text-rose-900 transition"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button 
            aria-label="Wishlist" 
            className="p-1 hover:text-rose-900 transition"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Shopping Cart Button with Badge */}
          <button 
            aria-label="Shopping Cart" 
            className="relative p-1 hover:text-rose-900 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-rose-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}