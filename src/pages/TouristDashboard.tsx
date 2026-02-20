import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomestayCard from "@/components/HomestayCard";
import { homestays, attractions } from "@/lib/mockData";
import { toast } from "sonner";
import {
  Search, Heart, MapPin, Calendar, Bell, LayoutDashboard,
  Bookmark, History, Star, TrendingUp, User, Settings
} from "lucide-react";

export default function TouristDashboard() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("discover");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || "");

  const notifications = [
    "Your trip to Manali is confirmed.",
    "Price drop alert: Beachside Paradise is now ₹2,300/night.",
    "You got a new review reply from Mountain Dew Cottage.",
  ];

  const tabs = [
    { id: "discover", label: "Discover", icon: LayoutDashboard },
    { id: "attractions", label: "Attractions", icon: Bookmark },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: User },
  ];

  const [upcomingTrips, setUpcomingTrips] = useState([
    { id: "1", homestay: "Mountain Dew Cottage", location: "Manali", dates: "Mar 15 - Mar 18, 2025", guests: 2, amount: 3600, status: "Confirmed", image: "/src/assets/homestay-1.jpg" },
    { id: "2", homestay: "Kerala Heritage Home", location: "Munnar", dates: "Apr 5 - Apr 8, 2025", guests: 4, amount: 5400, status: "Pending", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" },
  ]);

  const handleStatClick = (label: string) => {
    if (label === "Trips Taken") {
      setActiveTab("history");
      return;
    }
    if (label === "Wishlist") {
      setActiveTab("wishlist");
      return;
    }
    if (label === "Reviews Given") {
      toast.success("Reviews section will be available in your profile soon.");
      return;
    }
    if (label === "Places Visited") {
      setActiveTab("history");
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ name: profileName.trim(), email: profileEmail.trim(), avatar: profileAvatar });
    toast.success("Profile settings updated.");
  };

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    const allowedTabs = new Set(["discover", "attractions", "wishlist", "bookings", "history", "profile"]);

    if (tab && allowedTabs.has(tab)) {
      setActiveTab(tab);
      return;
    }

    if (!tab) {
      setActiveTab("discover");
    }
  }, [location.search]);

  useEffect(() => {
    setProfileName(user?.name || "");
    setProfileEmail(user?.email || "");
    setProfileAvatar(user?.avatar || "");
  }, [user]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileAvatar(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const activeBookings = upcomingTrips.filter((trip) => trip.status !== "Cancelled");
  const selectedTrip = upcomingTrips.find((trip) => trip.id === selectedTripId) || null;

  const handleViewBookingDetails = (tripId: string) => {
    setSelectedTripId(tripId);
  };

  const handleCancelBooking = (tripId: string) => {
    setUpcomingTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, status: "Cancelled" } : trip)));
    if (selectedTripId === tripId) {
      setSelectedTripId(null);
    }
    toast.success("Booking cancelled.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/150"}
                  alt={user?.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/30"
                />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Ready for your next adventure?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => setActiveTab("profile")}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                  title="Profile Settings"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setNotificationsOpen((v) => !v)}
                  className="relative p-2 hover:bg-muted rounded-xl transition-colors"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg z-20 p-3">
                    <p className="font-semibold text-sm text-foreground mb-2">Notifications</p>
                    <div className="space-y-2">
                      {notifications.map((item, i) => (
                        <div key={i} className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-2">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-6 border-b border-border overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {activeTab === "discover" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Trips Taken", value: "7", icon: "✈️" },
                  { label: "Wishlist", value: "12", icon: "❤️" },
                  { label: "Reviews Given", value: "5", icon: "⭐" },
                  { label: "Places Visited", value: "18", icon: "📍" },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => handleStatClick(stat.label)}
                    className="card-travel p-4 text-center w-full"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </button>
                ))}
              </div>

              {/* Upcoming Trips */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Upcoming Trips
                </h2>
                <div className="space-y-3">
                  {activeBookings.map((trip) => (
                    <div key={trip.id} className="card-travel p-4 flex items-center gap-4">
                      <img
                        src={trip.image}
                        alt={trip.homestay}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&q=80"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{trip.homestay}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {trip.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">📅 {trip.dates} • 👥 {trip.guests} guests</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-primary">₹{trip.amount.toLocaleString()}</div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trip.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Recommended for You
                  </h2>
                  <Link to="/homestays" className="text-primary text-sm font-medium">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {homestays.slice(0, 3).map((h) => (
                    <HomestayCard key={h.id} homestay={h} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Nearby Attractions
                  </h2>
                  <button onClick={() => setActiveTab("attractions")} className="text-primary text-sm font-medium">View all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {attractions.slice(0, 3).map((attr) => (
                    <div key={attr.id} className="card-travel overflow-hidden">
                      <img
                        src={attr.image}
                        alt={attr.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80"; }}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{attr.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{attr.location} • {attr.bestTime}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{attr.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attractions" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Tourist Attractions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {attractions.map((attr) => (
                  <div key={attr.id} className="card-travel overflow-hidden">
                    <img
                      src={attr.image}
                      alt={attr.name}
                      className="w-full h-44 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"; }}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{attr.name}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{attr.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">📍 {attr.location} • {attr.distance}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{attr.description}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>🕐 {attr.bestTime}</span>
                        <span>{attr.entryFee === 0 ? "Free Entry" : `₹${attr.entryFee} entry`}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" /> My Wishlist
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {homestays.slice(0, 4).map((h) => (
                  <HomestayCard key={h.id} homestay={h} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Active Bookings
              </h2>
              <div className="space-y-4">
                {activeBookings.map((trip) => (
                  <div key={trip.id} className="card-travel p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={trip.image}
                        alt={trip.homestay}
                        className="w-20 h-20 rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&q=80"; }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{trip.homestay}</h3>
                            <p className="text-muted-foreground">{trip.location}</p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${trip.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Dates</p>
                            <p className="text-sm font-medium text-foreground">{trip.dates}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Guests</p>
                            <p className="text-sm font-medium text-foreground">{trip.guests} guests</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-sm font-bold text-primary">₹{trip.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleViewBookingDetails(trip.id)}
                            className="text-sm btn-outline-primary py-1.5"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleCancelBooking(trip.id)}
                            className="text-sm text-destructive border border-destructive rounded-xl px-4 py-1.5 hover:bg-destructive/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {activeBookings.length === 0 && (
                  <div className="card-travel p-6 text-center text-muted-foreground">
                    No active bookings right now.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Profile Settings
              </h2>
              <div className="card-travel p-6 max-w-xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={profileAvatar || "https://i.pravatar.cc/150"}
                    alt="Profile"
                    className="w-16 h-16 rounded-2xl object-cover border border-border"
                  />
                  <label className="btn-outline-primary text-sm py-1.5 px-3 cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="space-y-3">
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="input-search w-full"
                    placeholder="Name"
                  />
                  <input
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="input-search w-full"
                    placeholder="Email"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={handleSaveProfile} className="btn-primary text-sm py-1.5">Save</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Travel History
              </h2>
              <div className="space-y-3">
                {[
                  { name: "Desert Dunes Camp", location: "Jaisalmer", date: "Dec 2024", amount: 7000, rating: 5 },
                  { name: "Beachside Paradise", location: "Goa", date: "Oct 2024", amount: 5000, rating: 4 },
                  { name: "Rishikesh River View", location: "Rishikesh", date: "Aug 2024", amount: 1998, rating: 5 },
                ].map((h, i) => (
                  <div key={i} className="card-travel p-4 flex items-center gap-4">
                    <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🏠</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{h.name}</h3>
                      <p className="text-sm text-muted-foreground">{h.location} • {h.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">₹{h.amount.toLocaleString()}</div>
                      <div className="flex items-center gap-0.5 justify-end">
                        {Array.from({ length: h.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedTrip && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md p-5">
              <h3 className="text-lg font-bold text-foreground mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">Homestay:</span> {selectedTrip.homestay}</p>
                <p><span className="font-semibold text-foreground">Location:</span> {selectedTrip.location}</p>
                <p><span className="font-semibold text-foreground">Dates:</span> {selectedTrip.dates}</p>
                <p><span className="font-semibold text-foreground">Guests:</span> {selectedTrip.guests}</p>
                <p><span className="font-semibold text-foreground">Amount:</span> ₹{selectedTrip.amount.toLocaleString()}</p>
                <p><span className="font-semibold text-foreground">Status:</span> {selectedTrip.status}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setSelectedTripId(null)} className="btn-outline-primary text-sm py-1.5">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
