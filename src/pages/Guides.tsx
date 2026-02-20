import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Star, MapPin, MessageCircle } from "lucide-react";

export default function Guides() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleContactGuide = (guideName: string, location: string) => {
    if (!isLoggedIn) {
      navigate("/auth?mode=login");
      return;
    }

    const subject = `Guide contact request - ${guideName}`;
    const body = [
      `Hi StayVista Team,`,
      "",
      `I want to connect with ${guideName} in ${location}.`,
      "Please share booking/contact availability.",
      "",
      `Name: ${user?.name || ""}`,
      `Email: ${user?.email || ""}`,
    ].join("\n");

    window.location.href = `mailto:guides@stayvista.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="gradient-nature text-white py-12 px-4 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Local Expert Guides</h1>
          <p className="text-white/80 max-w-xl mx-auto">Connect with passionate locals who know every hidden corner, trail, and story of their region.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...guides, ...guides].map((guide, i) => (
              <div key={i} className="card-travel p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-border flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{guide.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{guide.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="font-bold text-sm text-foreground">{guide.rating}</span>
                      <span className="text-xs text-muted-foreground">({guide.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{guide.about}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {guide.specialties.map((s) => (
                    <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <span>🌐 {guide.languages.slice(0, 2).join(", ")}</span>
                  <span>·</span>
                  <span>📅 {guide.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary">₹{guide.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">/day</span>
                  </div>
                  <button
                    onClick={() => handleContactGuide(guide.name, guide.location)}
                    className="btn-primary text-sm py-2 flex items-center gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4" /> Contact
                  </button>
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
