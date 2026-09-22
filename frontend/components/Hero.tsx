"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Timeless Festive Grace",
    subtitle: "Handcrafted Anarkalis & Embroidered Kurtas",
    badge: "New Festive Edition 2026",
    buttonText: "Shop Collection",
    link: "/collections",
    imageUrl:
      "/homepage111.webp",
    position: "center",
  },
  {
    id: 2,
    title: "The Royal Silk Edit",
    subtitle: "Luxurious Silks Designed for Celebrations",
    badge: "Exclusive Launch",
    buttonText: "Explore Silks",
    link: "/collections",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&h=800&q=80",
    position: "center 40%",
  },
  {
    id: 3,
    title: "Pure Cotton Comfort",
    subtitle: "Breathable Daily Essentials & Elegant Prints",
    badge: "Bestseller Everyday",
    buttonText: "View Daily Wear",
    link: "/collections",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&h=800&q=80",
    position: "center 45%",
  },
  {
    id: 4,
    title: "Modern Heritage Sets",
    subtitle: "Shararas & Kurta Dupatta Combinations",
    badge: "Trending Now",
    buttonText: "Shop Festive",
    link: "/collections",
    imageUrl:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1920&h=800&q=80",
    position: "center 40%",
  },
  {
    id: 5,
    title: "Bridal & Trousseau",
    subtitle: "Intricate Zari & Zardozi Craftsmanship",
    badge: "Handloom Heritage",
    buttonText: "Discover Couture",
    link: "/collections",
    imageUrl:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1920&h=800&q=80",
    position: "center 45%",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[00px] md:h-[500px] overflow-hidden bg-stone-900 select-none">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0"
          }`}
        >
        <Image
  src={slide.imageUrl}
  alt={slide.title}
  fill
  priority={index === 0}
  className="object-contain"
  style={{
    objectPosition: "center, center",
  }}
/>

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start text-white">
            <span className="inline-block bg-[#841934] text-white text-xs uppercase tracking-[0.25em] px-3.5 py-1.5 rounded font-bold mb-4">
              {slide.badge}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold max-w-2xl leading-tight">
              {slide.title}
            </h1>

            <p className="text-gray-200 text-sm sm:text-lg mt-4 max-w-lg font-light">
              {slide.subtitle}
            </p>

            <Link
              href={slide.link}
              className="mt-8 px-8 py-3.5 bg-white text-black text-xs sm:text-sm font-bold tracking-widest uppercase rounded hover:bg-[#841934] hover:text-white transition duration-300"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/70 text-white backdrop-blur-sm transition"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/70 text-white backdrop-blur-sm transition"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

