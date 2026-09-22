"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

type ProductCardProps = {
  title: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  badge?: string;
};

export default function ProductCard({
  title,
  price = "₹2,499",
  originalPrice = "₹3,499",
  image = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
  badge = "SALE",
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-stone-300">
      
      {/* Top Image Section */}
      <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badge (Sale / New) */}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#841934] text-white text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
            {badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-rose-600 text-rose-600" : "text-gray-700"
            }`}
          />
        </button>

        {/* Quick Add to Cart button that slides up on desktop hover */}
        <button
          className="absolute bottom-3 left-3 right-3 py-2.5 bg-black/85 hover:bg-[#841934] text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center space-x-2 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          <span>Add to Bag</span>
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-grow text-center">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#841934] transition line-clamp-1">
          {title}
        </h3>

        {/* Price & Discount */}
        <div className="mt-2 flex items-center justify-center space-x-2">
          <span className="text-base font-bold text-gray-950">{price}</span>
          {originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}