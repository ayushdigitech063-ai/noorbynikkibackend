"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const festivalSlides = [
  {
    id: 1,
    alt: "Festive Banner 1 - Eid",
    src: "/festive-collection-lookbook-photography-36_orig.jpg",
    link: "/collection",
  },
  {
    id: 2,
    alt: "Festive Banner 2 - Navratri",
    src: "/festive-collection-lookbook-photography-36_orig.jpg",
    link: "/collection",
  },
  {
    id: 3,
    alt: "Festive Banner 3 - Rakhi",
    src: "/festive-collection-lookbook-photography-36_orig.jpg",
    link: "/collection",
  },
  {
    id: 4,
    alt: "Festive Banner 4 - Diwali",
    src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    link: "/collection",
  },
];

export default function FestivalSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % festivalSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? festivalSlides.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % festivalSlides.length);
  };

  return (
    <section className="relative w-full bg-[#FAF7F2] overflow-hidden py-4 md:py-8 border-y border-stone-200">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        {/* Main Aspect Ratio Frame */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] min-h-[320px] max-h-[600px] rounded-2xl overflow-hidden bg-stone-100 shadow-md">
          
          {/* Slides */}
          {festivalSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain object-center w-full h-full"
              />

              {/* Floating Center Button */}
              <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20">
                <Link
                  href={slide.link}
                  className="inline-flex items-center justify-center px-5 py-2 sm:px-8 sm:py-3.5 bg-[#6B1D1D] hover:bg-[#521414] text-white font-medium text-[11px] sm:text-sm tracking-widest uppercase rounded-full shadow-xl border border-amber-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            </div>
          ))}

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {festivalSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-5 sm:w-6 bg-[#6B1D1D]"
                    : "w-1.5 sm:w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}