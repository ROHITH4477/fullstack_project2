import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { restaurants, chefs } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, MapPin, Clock, UtensilsCrossed, ChefHat, MessageCircle, Leaf, Flame } from "lucide-react";

export default function Dining() {
  const [tab, setTab] = useState<"restaurants" | "chefs">("restaurants");
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleBookChef = (chefName: string, location: string) => {
    if (!isLoggedIn) {
      navigate("/auth?mode=login");
      return;
    }

    const subject = `Chef booking request - ${chefName}`;
    const body = [
      `Hi StayVista Team,`,
      "",
      `I want to book ${chefName} in ${location}.`,
      "Please share availability and next steps.",
      "",
      `Name: ${user?.name || ""}`,
      `Email: ${user?.email || ""}`,
    ].join("\n");

    window.location.href = `mailto:bookings@stayvista.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleBookTable = (restaurantName: string, location: string) => {
    if (!isLoggedIn) {
      navigate("/auth?mode=login");
      return;
    }

    const subject = `Table booking request - ${restaurantName}`;
    const body = [
      `Hi StayVista Team,`,
      "",
      `I want to reserve a table at ${restaurantName} in ${location}.`,
      "Please share available slots.",
      "",
      `Name: ${user?.name || ""}`,
      `Email: ${user?.email || ""}`,
    ].join("\n");

    window.location.href = `mailto:dining@stayvista.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Booking request started for ${restaurantName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="gradient-warm text-white py-12 px-4 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dine Your Way
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Enjoy local restaurants nearby or book a private chef to cook authentic meals right at your homestay.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setTab("restaurants")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === "restaurants"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" /> Dine at a Restaurant
            </button>
            <button
              onClick={() => setTab("chefs")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === "chefs"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <ChefHat className="h-4 w-4" /> Cook at Home — Hire a Chef
            </button>
          </div>

          {/* Restaurants */}
          {tab === "restaurants" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {restaurants.map((r) => (
                <div key={r.id} className="card-travel group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {r.isVeg && (
                        <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf className="h-3 w-3" /> Pure Veg
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-xs font-bold text-foreground">{r.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{r.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{r.location}</span>
                      <span className="ml-auto">{r.distance} away</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.cuisine.map((c) => (
                        <span key={c} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">{c}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Flame className="h-3.5 w-3.5 text-accent" />
                      <span className="font-medium text-foreground">Must try:</span> {r.specialDish}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-sm font-bold text-primary">{r.priceRange}</span>
                      <button
                        onClick={() => handleBookTable(r.name, r.location)}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Book Table
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3.5 w-3.5" /> {r.openHours}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chefs */}
          {tab === "chefs" && (
            <div>
              <div className="bg-muted/50 rounded-2xl p-5 mb-8 border border-border">
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" /> How it works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse local chefs near your homestay → Contact them → They come to your stay and cook fresh, authentic meals using local ingredients. Perfect for families, groups, or a special dinner under the stars!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {chefs.map((chef) => (
                  <div key={chef.id} className="card-travel p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={chef.image} alt={chef.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-border flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{chef.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{chef.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="font-bold text-sm text-foreground">{chef.rating}</span>
                          <span className="text-xs text-muted-foreground">({chef.reviews} reviews)</span>
                        </div>
                      </div>
                      {chef.available && (
                        <span className="bg-secondary/20 text-secondary text-xs font-semibold px-2 py-1 rounded-full">Available</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{chef.about}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {chef.specialties.map((s) => (
                        <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <span>🌐 {chef.languages.slice(0, 2).join(", ")}</span>
                      <span>·</span>
                      <span>👨‍🍳 {chef.experience}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <div className="text-lg font-bold text-primary">₹{chef.pricePerMeal.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/meal</span></div>
                        <div className="text-xs text-muted-foreground">₹{chef.pricePerDay.toLocaleString()}/full day</div>
                      </div>
                      <button
                        onClick={() => handleBookChef(chef.name, chef.location)}
                        className="btn-primary text-sm py-2 flex items-center gap-1.5"
                      >
                        <MessageCircle className="h-4 w-4" /> Book Chef
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
