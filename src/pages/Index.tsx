import heroImg from "@/assets/hero-bg.jpg";
import SearchBar from "@/components/SearchBar";
import HomestayCard from "@/components/HomestayCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, ChevronRight, TrendingUp, Map, Shield, Award, UtensilsCrossed, ChefHat } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { homestays, categories, trendingDestinations, reviews, guides, attractions, restaurants, chefs } from "@/lib/mockData";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();

  const handleUseOfferCode = async () => {
    const code = "STAYFIRST";

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Offer code copied: STAYFIRST");
    } catch {
      toast.success("Use code STAYFIRST at checkout.");
    }

    navigate("/homestays");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Beautiful Indian homestay at golden sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto pt-16">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-white/30 text-white rounded-full px-4 py-2 mb-6 animate-fade-in-up">
            <span className="text-accent text-sm">🏡</span>
            <span className="text-sm font-medium">India's #1 Homestay Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight animate-fade-in-up-delay-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover India's Most
            <br />
            <span style={{ background: "var(--gradient-hero-text)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Authentic Stays
            </span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up-delay-2">
            Stay with local families, explore hidden gems with expert guides, and create memories that last a lifetime.
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up-delay-3">
            <SearchBar variant="hero" />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { value: "1,200+", label: "Verified Homestays" },
              { value: "4.8★", label: "Average Rating" },
              { value: "50,000+", label: "Happy Travellers" },
              { value: "340+", label: "Destinations" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading">Browse by Category</h2>
            <p className="text-muted-foreground mt-1">Find the perfect stay for your travel style</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/homestays?category=${cat.name}`}
              className="card-travel p-4 flex flex-col items-center text-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-semibold text-sm text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count} stays</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading">Featured Homestays</h2>
            <p className="text-muted-foreground mt-1">Handpicked for exceptional experiences</p>
          </div>
          <Link to="/homestays" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homestays.filter(h => h.isFeatured).map((homestay) => (
            <HomestayCard key={homestay.id} homestay={homestay} />
          ))}
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="section-heading">Popular Destinations</h2>
          </div>
          <Link to="/homestays" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
            Explore all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingDestinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/homestays?location=${dest.name}`}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-sm">{dest.name}</p>
                <p className="text-white/75 text-xs">{dest.stays} stays</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="gradient-warm rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 text-9xl flex items-center justify-center">🏡</div>
            <div className="relative z-10">
              <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">🎉 LIMITED TIME OFFER</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Flat 20% Off on First Booking!
              </h2>
              <p className="text-white/85 mb-6 max-w-lg">
                Use code <strong>STAYFIRST</strong> on your first homestay booking. Valid for new users. Min booking ₹1500.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/homestays" className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105">
                  Book Now
                </Link>
                <button
                  onClick={handleUseOfferCode}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-mono font-bold px-6 py-3 rounded-xl tracking-widest hover:bg-white/25 transition-colors"
                >
                  STAYFIRST
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="h-5 w-5 text-secondary" />
              <span className="text-sm font-semibold text-secondary uppercase tracking-wide">Explore</span>
            </div>
            <h2 className="section-heading">Tourist Attractions</h2>
          </div>
          <Link to="/attractions" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {attractions.map((attr) => (
            <Link key={attr.id} to="/attractions" className="card-travel group overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={attr.image}
                  alt={attr.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    {attr.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-bold text-foreground">{attr.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{attr.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{attr.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>📍 {attr.location}</span>
                  <span>{attr.entryFee === 0 ? "Free Entry" : `₹${attr.entryFee} entry`}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dining & Chefs */}
      <section className="py-12 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Food & Dining</span>
              </div>
              <h2 className="section-heading">Dine Your Way</h2>
              <p className="text-muted-foreground mt-1">Eat at local restaurants or hire a chef to cook at your homestay</p>
            </div>
            <Link to="/dining" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Restaurants Preview */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-primary" /> Nearby Restaurants</h3>
              <div className="space-y-3">
                {restaurants.slice(0, 3).map((r) => (
                  <Link key={r.id} to="/dining" className="card-travel p-4 flex gap-4 items-center group hover:border-primary/30">
                    <img src={r.image} alt={r.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{r.name}</h4>
                      <p className="text-xs text-muted-foreground">{r.location} · {r.distance}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /><span className="text-xs font-bold">{r.rating}</span></div>
                        <span className="text-xs text-muted-foreground">{r.priceRange}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Chefs Preview */}
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><ChefHat className="h-4 w-4 text-primary" /> Hire a Local Chef</h3>
              <div className="space-y-3">
                {chefs.slice(0, 3).map((c) => (
                  <Link key={c.id} to="/dining" className="card-travel p-4 flex gap-4 items-center group hover:border-primary/30">
                    <img src={c.image} alt={c.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border-2 border-border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{c.name}</h4>
                      <p className="text-xs text-muted-foreground">{c.location} · {c.experience}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.specialties.slice(0, 2).map((s) => (
                          <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-primary">₹{c.pricePerMeal}</div>
                      <div className="text-xs text-muted-foreground">/meal</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Guides */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading">Local Expert Guides</h2>
            <p className="text-muted-foreground mt-1">Explore with people who know every hidden corner</p>
          </div>
          <Link to="/guides" className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
            All guides <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} to="/guides" className="card-travel p-5 flex gap-4 items-start group hover:border-primary/30">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border-2 border-border group-hover:border-primary/40 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{guide.name}</h3>
                    <p className="text-xs text-muted-foreground">{guide.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-bold">{guide.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{guide.about}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {guide.specialties.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-primary">₹{guide.price}/day</span>
                  <span className="text-xs text-muted-foreground">{guide.experience} exp</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why StayVista */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-heading mb-2">Why Choose StayVista?</h2>
          <p className="text-muted-foreground mb-10">We go beyond just accommodation</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified & Safe", desc: "Every homestay is personally verified with ID-checked hosts and safety standards." },
              { icon: Award, title: "Best Price Guarantee", desc: "Find the same homestay cheaper elsewhere? We'll match the price, no questions asked." },
              { icon: Map, title: "Local Experience", desc: "Get insider tips, local food, and curated itineraries from people who call it home." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl p-6 text-left border border-border hover:border-primary/30 transition-colors hover:shadow-md">
                <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-heading">What Travellers Say</h2>
          <p className="text-muted-foreground mt-1">Real stories from real travellers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="card-travel p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={rev.avatar} alt={rev.user} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-foreground">{rev.user}</p>
                  <p className="text-xs text-muted-foreground">{rev.homestay} • {rev.date}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-foreground rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/75 mb-8 max-w-xl mx-auto">
                Join 50,000+ travellers who discovered India's most authentic homestays. Sign up free and get ₹500 off your first booking.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/auth?mode=signup" className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-lg">
                  Start Exploring — It's Free
                </Link>
                <Link to="/homestays" className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-all">
                  Browse Homestays
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
