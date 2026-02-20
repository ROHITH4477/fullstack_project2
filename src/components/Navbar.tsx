import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, MapPin, Heart, Bell, User, LogOut, ChevronDown, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [
    "You have a new booking update",
    "2 offers are available in your wishlist",
    "Your profile is 90% complete",
  ];

  const getDashboardPath = () => {
    if (!user) return "/auth";
    switch (user.role) {
      case "host": return "/host-dashboard";
      case "guide": return "/guide-dashboard";
      case "admin": return "/admin-dashboard";
      default: return "/tourist-dashboard";
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Homestays", path: "/homestays" },
    { label: "Attractions", path: "/attractions" },
    { label: "Dining", path: "/dining" },
    { label: "Local Guides", path: "/guides" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Stay<span className="text-gradient-warm">Vista</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="nav-link text-sm">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button onClick={() => setNotificationOpen((v) => !v)} className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  </button>
                  {notificationOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl p-3 z-50">
                      <p className="font-semibold text-sm text-foreground mb-2">Notifications</p>
                      <div className="space-y-2">
                        {notifications.map((item, i) => (
                          <div key={i} className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-2">{item}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:bg-muted rounded-xl px-3 py-2 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-primary/30"
                    />
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border bg-muted/40">
                        <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4" /> My Dashboard
                      </Link>
                      <Link
                        to={`${getDashboardPath()}?tab=profile`}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4" /> Profile Settings
                      </Link>
                      <button
                        onClick={() => { logout(); navigate("/"); setProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-destructive"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-medium nav-link">Sign In</Link>
                <Link to="/auth?mode=signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link to={getDashboardPath()} className="block px-3 py-2.5 rounded-lg hover:bg-muted text-sm text-foreground" onClick={() => setMobileOpen(false)}>
                  My Dashboard
                </Link>
                <Link to={`${getDashboardPath()}?tab=profile`} className="block px-3 py-2.5 rounded-lg hover:bg-muted text-sm text-foreground" onClick={() => setMobileOpen(false)}>
                  Profile Settings
                </Link>
                <button
                  onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-50 text-sm text-destructive"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth" className="flex-1 text-center py-2 border border-border rounded-lg text-sm font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/auth?mode=signup" className="flex-1 text-center py-2 btn-primary text-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
