import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { attractions } from "@/lib/mockData";
import { Star, MapPin, Clock, Ticket, Bookmark } from "lucide-react";

export default function Attractions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="bg-secondary text-secondary-foreground py-12 px-4 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Tourist Attractions</h1>
          <p className="text-secondary-foreground/80 max-w-xl mx-auto">Discover India's most breathtaking landmarks, hidden gems, and natural wonders curated by our local experts.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...attractions, ...attractions].map((attr, i) => (
              <div key={i} className="card-travel group overflow-hidden flex flex-col md:flex-row">
                <div className="relative overflow-hidden md:w-48 flex-shrink-0">
                  <img
                    src={attr.image}
                    alt={attr.name}
                    className="w-full md:w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">{attr.category}</span>
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-foreground text-lg leading-tight">{attr.name}</h3>
                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{attr.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" />{attr.location} · {attr.distance}</div>
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{attr.rating} rating</div>
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Best: {attr.bestTime}</div>
                    <div className="flex items-center gap-1"><Ticket className="h-3.5 w-3.5" />{attr.entryFee === 0 ? "Free Entry" : `₹${attr.entryFee}`}</div>
                  </div>
                  <button className="mt-4 btn-outline-primary text-xs py-1.5 px-4">Save to Itinerary</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
