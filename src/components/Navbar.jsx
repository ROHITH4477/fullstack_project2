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
        if (!user)
            return "/auth";
        switch (user.role) {
            case "host": return "/host-dashboard";
            case "guide": return "/guide-dashboard";
            case "admin": return "/admin-dashboard";
            default: return "/tourist-dashboard";
        }
    };
    const getDefaultDashboardTab = () => {
        if (!user)
            return "overview";
        switch (user.role) {
            case "tourist": return "discover";
            case "host": return "overview";
            case "guide": return "overview";
            case "admin": return "overview";
            default: return "overview";
        }
    };
    const openDashboard = () => {
        navigate(`${getDashboardPath()}?tab=${getDefaultDashboardTab()}&t=${Date.now()}`);
        setProfileOpen(false);
        setMobileOpen(false);
    };
    const openProfileSettings = () => {
        navigate(`${getDashboardPath()}?tab=profile&t=${Date.now()}`);
        setProfileOpen(false);
        setMobileOpen(false);
    };
    const navLinks = [
        { label: "Home", path: "/" },
        { label: "Homestays", path: "/homestays" },
        { label: "Attractions", path: "/attractions" },
        { label: "Dining", path: "/dining" },
        { label: "Local Guides", path: "/guides" },
    ];
    return (<nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_30px_-18px_hsl(var(--primary)/0.9)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 gradient-warm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Home className="h-5 w-5 text-primary-foreground"/>
            </div>
            <span className="font-bold text-xl text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Stay<span className="text-gradient-warm">Vista</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 bg-card/65 border border-white/10 backdrop-blur-xl rounded-full px-2 py-1">
            {navLinks.map((link) => (<Link key={link.path} to={link.path} className="nav-link text-sm px-3 py-1.5 rounded-full hover:bg-primary/15 hover:text-primary">
                {link.label}
              </Link>))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (<>
                <div className="relative">
                  <button onClick={() => setNotificationOpen((v) => !v)} className="relative p-2.5 hover:bg-primary/15 rounded-2xl border border-transparent hover:border-primary/30">
                    <Bell className="h-5 w-5 text-foreground/90"/>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"/>
                  </button>
                  {notificationOpen && (<div className="absolute right-0 top-full mt-2 w-72 bg-card/95 border border-white/15 rounded-2xl shadow-xl backdrop-blur-xl p-3 z-50">
                      <p className="font-semibold text-sm text-foreground mb-2">Notifications</p>
                      <div className="space-y-2">
                        {notifications.map((item, i) => (<div key={i} className="text-xs text-muted-foreground bg-muted/45 border border-white/10 rounded-xl p-2">{item}</div>))}
                      </div>
                    </div>)}
                </div>
                <button className="p-2.5 hover:bg-primary/15 rounded-2xl border border-transparent hover:border-primary/30">
                  <Heart className="h-5 w-5 text-foreground/90"/>
                </button>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:bg-primary/15 rounded-2xl px-3 py-2 border border-white/10">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-2xl object-cover border border-primary/50"/>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground"/>
                  </button>
                  {profileOpen && (<div className="absolute right-0 top-full mt-2 w-52 bg-card/95 border border-white/15 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border/80 bg-muted/45">
                        <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                      <button type="button" className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted/75 text-sm text-foreground w-full text-left" onClick={openDashboard}>
                        <User className="h-4 w-4"/> My Dashboard
                      </button>
                      <button type="button" className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted/75 text-sm text-foreground w-full text-left" onClick={openProfileSettings}>
                        <User className="h-4 w-4"/> Profile Settings
                      </button>
                      <button onClick={() => { logout(); navigate("/"); setProfileOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-destructive/10 text-sm text-destructive">
                        <LogOut className="h-4 w-4"/> Sign Out
                      </button>
                    </div>)}
                </div>
              </>) : (<>
                <Link to="/auth" className="text-sm font-medium nav-link">Sign In</Link>
                <Link to="/auth?mode=signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>)}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2.5 hover:bg-primary/15 rounded-2xl border border-white/10" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (<div className="md:hidden bg-card/95 backdrop-blur-2xl border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (<Link key={link.path} to={link.path} className="block px-3 py-2.5 rounded-xl hover:bg-muted/75 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>))}
          <div className="pt-2 border-t border-border/80 mt-2">
            {isLoggedIn ? (<div className="space-y-1">
                <button type="button" className="block w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/75 text-sm text-foreground" onClick={openDashboard}>
                  My Dashboard
                </button>
                <button type="button" className="block w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/75 text-sm text-foreground" onClick={openProfileSettings}>
                  Profile Settings
                </button>
                <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-sm text-destructive">
                  Sign Out
                </button>
              </div>) : (<div className="flex gap-2">
                <Link to="/auth" className="flex-1 text-center py-2 border border-border rounded-xl text-sm font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/auth?mode=signup" className="flex-1 text-center py-2 btn-primary text-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>)}
          </div>
        </div>)}
    </nav>);
}
