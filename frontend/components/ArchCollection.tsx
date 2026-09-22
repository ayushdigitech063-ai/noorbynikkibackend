import Link from "next/link";
import { Sparkles } from "lucide-react";

const archItems = [
  {
    title: "DARK RED FLORAL PRINTED...",
    actionText: "CLICK TO VIEW DETAILS",
    link: "/products/dark-red-floral",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "ANGRAKHA FESTIVAL ANARKA...",
    actionText: "CLICK TO VIEW DETAILS",
    link: "/products/angrakha-anarkali",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "OFF WHITE STRAIGHT SUIT SET",
    actionText: "CLICK TO VIEW DETAILS",
    link: "/products/off-white-suit",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "ELEGANT PRINTED SUIT SET",
    actionText: "CLICK TO VIEW DETAILS",
    link: "/products/elegant-printed-suit",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ArchCollection() {
  return (
    <section className="bg-[#fcf7f3] py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-center">
        {/* Top Festival Offers Pill */}
        <div className="inline-flex items-center space-x-1.5 bg-[#fbe7ec] text-[#a01f3f] px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Festival Offers</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-4xl font-serif tracking-[0.2em] text-[#1c1917] uppercase mb-12">
          Explore Collection
        </h2>

        {/* Arched Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {archItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative block overflow-hidden rounded-t-[140px] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Arched Image Container */}
              <div className="w-full h-[360px] sm:h-[460px] bg-stone-200 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Bottom Info Banner */}
              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] p-3 text-center text-white">
                <p className="text-[11px] font-semibold tracking-wider truncate uppercase">
                  {item.title}
                </p>
                <p className="text-[9px] text-stone-300 tracking-widest uppercase mt-0.5 font-light">
                  {item.actionText}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}