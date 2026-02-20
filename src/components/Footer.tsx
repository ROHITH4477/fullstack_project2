import { Link } from "react-router-dom";
import { Home, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Stay<span className="text-accent">Vista</span>
              </span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Connecting travellers with authentic homestay experiences across India. Discover local life, hidden gems, and real hospitality.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-background/60 mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                { label: "Homestays", path: "/homestays" },
                { label: "Tourist Attractions", path: "/attractions" },
                { label: "Dining & Chefs", path: "/dining" },
                { label: "Local Guides", path: "/guides" },
                { label: "Special Offers", path: "/homestays" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm text-background/80 hover:text-accent transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For You */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-background/60 mb-4">For You</h4>
            <ul className="space-y-2">
              {[
                { label: "Tourist Login", path: "/auth" },
                { label: "List Your Property", path: "/auth?mode=signup" },
                { label: "Become a Guide", path: "/auth?mode=signup" },
                { label: "Travel Blog", path: "/" },
                { label: "Gift Cards", path: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm text-background/80 hover:text-accent transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-background/60 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:hello@stayvista.com" className="flex items-center gap-2 text-sm text-background/80 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" /> hello@stayvista.com
              </a>
              <a href="tel:+911800123456" className="flex items-center gap-2 text-sm text-background/80 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" /> 1800-123-4567 (Toll Free)
              </a>
            </div>
            <div className="mt-4 p-3 bg-background/10 rounded-xl">
              <p className="text-xs text-background/60 font-medium mb-1">24/7 Support</p>
              <p className="text-xs text-background/80">Available in Hindi, English & 8 regional languages</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/50">© 2025 StayVista. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "About Us"].map((item) => (
              <Link key={item} to="/" className="text-xs text-background/50 hover:text-accent transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
