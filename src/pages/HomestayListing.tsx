import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomestayCard from "@/components/HomestayCard";
import { homestays } from "@/lib/mockData";
import { SlidersHorizontal, Map, List, ChevronDown, X } from "lucide-react";

const PRICE_RANGES = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹3,500", min: 2000, max: 3500 },
  { label: "₹3,500+", min: 3500, max: Infinity },
];

const CATEGORIES = ["Family Stay", "Budget Stay", "Luxury", "Nature Stay", "Heritage", "Beach"];
const AMENITIES = ["WiFi", "Home Food", "Parking", "Pool", "AC", "Yoga"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function HomestayListing() {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get("location") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryQuery ? [categoryQuery] : []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);
  };

  let filtered = [...homestays];
  if (locationQuery) {
    filtered = filtered.filter((h) => h.location.toLowerCase().includes(locationQuery.toLowerCase()));
  }
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((h) => selectedCategories.includes(h.category));
  }
  if (selectedPriceRange !== null) {
    const range = PRICE_RANGES[selectedPriceRange];
    filtered = filtered.filter((h) => h.price >= range.min && h.price <= range.max);
  }
  if (selectedAmenities.length > 0) {
    filtered = filtered.filter((h) => selectedAmenities.every((a) => h.amenities.includes(a)));
  }
  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Sub-header */}
        <div className="bg-card border-b border-border px-4 md:px-6 py-4 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-foreground">
                {locationQuery ? `Homestays in ${locationQuery}` : "All Homestays"}
              </h1>
              <p className="text-sm text-muted-foreground">{filtered.length} properties found</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-search pr-8 py-2 text-sm appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {(selectedCategories.length + selectedAmenities.length + (selectedPriceRange !== null ? 1 : 0)) > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {selectedCategories.length + selectedAmenities.length + (selectedPriceRange !== null ? 1 : 0)}
                  </span>
                )}
              </button>
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <List className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <Map className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden md:block"} w-full md:w-64 flex-shrink-0 space-y-6 md:sticky md:top-36 md:h-fit`}>
            <div className="card-travel p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">Filters</h3>
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedAmenities([]); setSelectedPriceRange(null); }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Price per night</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedPriceRange === i ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="text-sm text-foreground">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Amenities</h4>
                <div className="space-y-2">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Active filters */}
            {(selectedCategories.length > 0 || selectedAmenities.length > 0 || selectedPriceRange !== null) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map((cat) => (
                  <span key={cat} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                    {cat}
                    <button onClick={() => toggleCategory(cat)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {selectedPriceRange !== null && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                    {PRICE_RANGES[selectedPriceRange].label}
                    <button onClick={() => setSelectedPriceRange(null)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏡</div>
                <h2 className="text-xl font-bold text-foreground mb-2">No homestays found</h2>
                <p className="text-muted-foreground">Try adjusting your filters or search a different location</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filtered.map((homestay) => (
                  <HomestayCard key={homestay.id} homestay={homestay} variant={viewMode === "list" ? "compact" : "default"} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
