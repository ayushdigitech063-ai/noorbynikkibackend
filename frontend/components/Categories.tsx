import Link from "next/link";

const categories = [
  {
    name: "Anarkali Sets",
    slug: "anarkali",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
  },
  {
    name: "Daily Kurtas",
    slug: "kurtas",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80",
  },
  {
    name: "Pure Silk Sarees",
    slug: "sarees",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80",
  },
  {
    name: "Coord & Shararas",
    slug: "coord-sets",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80",
  },
  {
    name: "Dupatta Edit",
    slug: "dupattas",
    imageUrl:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&auto=format&fit=crop&q=80",
  },
  {
    name: "Festive Lehengas",
    slug: "lehengas",
    imageUrl:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&auto=format&fit=crop&q=80",
  },
];

export default function Categories() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#841934]">
            Curated For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 mt-1">
            Shop by Category
          </h2>
        </div>

        {/* Categories List with Larger Dimensions */}
        <div className="flex items-center justify-start md:justify-center gap-8 sm:gap-12 overflow-x-auto no-scrollbar pb-6 pt-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="flex flex-col items-center group shrink-0 select-none"
            >
              {/* ENLARGED CIRCLE: 136px on mobile, 160px on desktop */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1.5 border-2 border-stone-200 group-hover:border-[#841934] transition duration-300 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              {/* Label */}
              <span className="text-sm sm:text-base font-semibold text-gray-900 mt-4 group-hover:text-[#841934] transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}