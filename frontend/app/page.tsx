import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductCard from "@/components/ProductCard";
import PromoBanner from "@/components/PromoBanner";
import FestivalSlider from "@/components/FestivalSlider"; 
import ArchCollection from "@/components/ArchCollection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero banner section at the top */}
      <Hero />

      {/* 2. Circular category list */}
      <Categories />
    

      {/* 4. NEW: Arched Doorway Explore Collection */}
      <ArchCollection />

      {/* 3. Featured products grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Featured Collection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard title="Floral Kurta Set" />
          <ProductCard title="Embroidered Anarkali" />
          <ProductCard title="Silk Party Suit" />
          <ProductCard title="Cotton Daily Wear" />
        </div>
      </section>
      
 {/* 3. NEW: Full-width Festival Slider (Happy Eid banner) */}
      <FestivalSlider />
      {/* 4. Promotional banner near the bottom */}
      <PromoBanner />
    </main>
  );
}