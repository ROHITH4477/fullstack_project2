import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Plus, Calendar, Star, DollarSign, Home, MessageSquare,
  CheckCircle, XCircle, Clock, Edit, Eye, TrendingUp
} from "lucide-react";

export default function HostDashboard() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [activeReplyTarget, setActiveReplyTarget] = useState<string | null>(null);
  const [replyTextByTarget, setReplyTextByTarget] = useState<Record<string, string>>({});
  const [hostName, setHostName] = useState(user?.name || "");
  const [hostEmail, setHostEmail] = useState(user?.email || "");
  const [hostAvatar, setHostAvatar] = useState(user?.avatar || "");
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyLocation, setNewPropertyLocation] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState(1200);

  const [properties, setProperties] = useState([
    { id: "1", name: "Mountain View Cottage", location: "Manali", price: 1200, status: "Active", bookings: 12, rating: 4.8, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80" },
    { id: "2", name: "Garden Guest Room", location: "Shimla", price: 850, status: "Active", bookings: 7, rating: 4.6, image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80" },
  ]);

  const propertyImagePool = [
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  ];

  const [bookingRequests, setBookingRequests] = useState([
    { id: "1", guest: "Sneha Patel", dates: "Mar 15-18", guests: 2, property: "Mountain View Cottage", amount: 3600, status: "pending", avatar: "https://i.pravatar.cc/50?img=25" },
    { id: "2", guest: "Rohit Kumar", dates: "Apr 5-8", guests: 4, property: "Garden Guest Room", amount: 2550, status: "confirmed", avatar: "https://i.pravatar.cc/50?img=65" },
    { id: "3", guest: "Anita Singh", dates: "Apr 20-22", guests: 3, property: "Mountain View Cottage", amount: 2400, status: "pending", avatar: "https://i.pravatar.cc/50?img=10" },
  ]);

  const reviews = [
    { id: "r1", guest: "Priya S.", property: "Mountain View Cottage", rating: 5, text: "Great host and clean rooms!" },
    { id: "r2", guest: "Rahul K.", property: "Garden Guest Room", rating: 4, text: "Comfortable stay and fast responses." },
  ];

  const messages = [
    { id: "m1", from: "Sneha Patel", text: "Can we check in early at 12 PM?", time: "10:32 AM" },
    { id: "m2", from: "Anita Singh", text: "Is parking available for SUV?", time: "Yesterday" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "properties", label: "My Properties", icon: Home },
    { id: "bookings", label: "Booking Requests", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: Edit },
  ];

  const updateBookingStatus = (requestId: string, status: "confirmed" | "rejected") => {
    setBookingRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status } : req)));
    toast.success(status === "confirmed" ? "Booking accepted successfully." : "Booking rejected.");
  };

  const handleAddProperty = () => {
    if (!newPropertyName.trim() || !newPropertyLocation.trim()) {
      toast.error("Please fill property name and location.");
      return;
    }

    const randomImage = propertyImagePool[Math.floor(Math.random() * propertyImagePool.length)];

    const newProperty = {
      id: Date.now().toString(),
      name: newPropertyName,
      location: newPropertyLocation,
      price: newPropertyPrice,
      status: "Active",
      bookings: 0,
      rating: 0,
      image: randomImage,
    };

    setProperties((prev) => [newProperty, ...prev]);
    setIsAddingProperty(false);
    setNewPropertyName("");
    setNewPropertyLocation("");
    setNewPropertyPrice(1200);
    toast.success("Property added successfully.");
  };

  const handleSaveProfile = () => {
    updateProfile({ name: hostName.trim(), email: hostEmail.trim(), avatar: hostAvatar });
    toast.success("Profile settings updated.");
  };

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    const allowedTabs = new Set(["overview", "properties", "bookings", "earnings", "reviews", "messages", "profile"]);

    if (tab && allowedTabs.has(tab)) {
      setActiveTab(tab);
      return;
    }

    if (!tab) {
      setActiveTab("overview");
    }
  }, [location.search]);

  useEffect(() => {
    setHostName(user?.name || "");
    setHostEmail(user?.email || "");
    setHostAvatar(user?.avatar || "");
  }, [user]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setHostAvatar(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleOverviewCardClick = (label: string) => {
    if (label === "Total Earnings") {
      setActiveTab("earnings");
      return;
    }

    if (label === "Active Bookings") {
      setActiveTab("bookings");
      setBookingStatusFilter("confirmed");
      return;
    }

    if (label === "Total Reviews") {
      setActiveTab("reviews");
      return;
    }

    if (label === "Occupancy Rate") {
      setActiveTab("properties");
    }
  };

  const visibleBookingRequests = bookingRequests.filter((req) => bookingStatusFilter === "all" || req.status === bookingStatusFilter);

  const handleOpenReply = (targetId: string) => {
    setActiveReplyTarget(targetId);
  };

  const handleSendReply = (targetId: string, targetName: string) => {
    const replyText = (replyTextByTarget[targetId] || "").trim();
    if (!replyText) {
      toast.error("Type your reply first.");
      return;
    }

    setReplyTextByTarget((prev) => ({ ...prev, [targetId]: "" }));
    setActiveReplyTarget(null);
    toast.success(`Reply sent to ${targetName}.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/30" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Host Dashboard 🏡</h1>
                  <p className="text-muted-foreground text-sm">Manage your properties & bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveTab("profile")} className="btn-outline-primary flex items-center gap-2 text-sm py-2">
                  <Edit className="h-4 w-4" /> Profile Settings
                </button>
                <button onClick={() => setIsAddingProperty(true)} className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Add Property
                </button>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
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
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Earnings", value: "₹42,500", icon: "💰", trend: "+12%" },
                  { label: "Active Bookings", value: "3", icon: "📅", trend: "+2" },
                  { label: "Total Reviews", value: "28", icon: "⭐", trend: "+5" },
                  { label: "Occupancy Rate", value: "78%", icon: "📊", trend: "+8%" },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => handleOverviewCardClick(stat.label)}
                    className="card-travel p-4 text-left w-full"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mt-2">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </button>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Pending Booking Requests</h2>
                <div className="space-y-3">
                  {bookingRequests.filter(b => b.status === "pending").map((req) => (
                    <div key={req.id} className="card-travel p-4 flex items-center gap-4">
                      <img src={req.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{req.guest}</p>
                        <p className="text-xs text-muted-foreground">{req.property} • {req.dates} • {req.guests} guests</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-primary">₹{req.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateBookingStatus(req.id, "confirmed")} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button onClick={() => updateBookingStatus(req.id, "rejected")} className="flex items-center gap-1 bg-red-100 text-destructive px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Properties</h2>
                <button onClick={() => setIsAddingProperty(true)} className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Add New Property
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((prop) => (
                  <div key={prop.id} className="card-travel overflow-hidden">
                    <div className="relative">
                      <img
                        src={prop.image}
                        alt={prop.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80"; }}
                      />
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${prop.status === "Active" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                        {prop.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground">{prop.name}</h3>
                      <p className="text-sm text-muted-foreground">{prop.location}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">₹{prop.price}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{prop.bookings}</p>
                          <p className="text-xs text-muted-foreground">bookings</p>
                        </div>
                        <div className="text-center flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <p className="text-lg font-bold text-foreground">{prop.rating}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 btn-outline-primary text-sm py-2 flex items-center justify-center gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button className="flex-1 border border-border rounded-xl py-2 text-sm flex items-center justify-center gap-1 hover:bg-muted transition-colors">
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add Property Card */}
                <button onClick={() => setIsAddingProperty(true)} className="card-travel border-2 border-dashed border-border hover:border-primary/50 p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all min-h-[300px]">
                  <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">Add New Property</span>
                  <span className="text-xs text-center">List your homestay and start earning</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold text-foreground">All Booking Requests</h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "pending", label: "Pending" },
                    { id: "confirmed", label: "Confirmed" },
                    { id: "rejected", label: "Rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setBookingStatusFilter(filter.id as "all" | "pending" | "confirmed" | "rejected")}
                      className={`text-xs px-3 py-1.5 rounded-full border ${bookingStatusFilter === filter.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {visibleBookingRequests.map((req) => (
                  <div key={req.id} className="card-travel p-5 flex items-center gap-4">
                    <img src={req.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-foreground">{req.guest}</p>
                          <p className="text-sm text-muted-foreground">{req.property}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          req.status === "confirmed" ? "bg-green-100 text-green-700" :
                          req.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-destructive"
                        }`}>
                          {req.status === "pending" ? "⏳ Pending" : req.status === "confirmed" ? "✅ Confirmed" : "❌ Rejected"}
                        </span>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <span>📅 {req.dates}</span>
                        <span>👥 {req.guests} guests</span>
                        <span className="font-bold text-primary">₹{req.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    {req.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateBookingStatus(req.id, "confirmed")} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors">Accept</button>
                        <button onClick={() => updateBookingStatus(req.id, "rejected")} className="bg-red-100 text-destructive px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "earnings" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Earnings Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "This Month", value: "₹18,500", icon: "📈" },
                  { label: "Total Earned", value: "₹1,42,500", icon: "💰" },
                  { label: "Pending Payout", value: "₹6,200", icon: "⏳" },
                ].map((e) => (
                  <div key={e.label} className="card-travel p-6 text-center">
                    <div className="text-3xl mb-2">{e.icon}</div>
                    <div className="text-3xl font-bold text-foreground">{e.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{e.label}</div>
                  </div>
                ))}
              </div>
              <div className="card-travel p-6">
                <h3 className="font-bold text-foreground mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {[
                    { guest: "Sneha Patel", amount: 3600, date: "Mar 18", status: "Received" },
                    { guest: "Rohit Kumar", amount: 2550, date: "Mar 10", status: "Received" },
                    { guest: "Anita Singh", amount: 4800, date: "Feb 25", status: "Received" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{t.guest}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+₹{t.amount.toLocaleString()}</p>
                        <p className="text-xs text-green-600">{t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Guest Reviews</h2>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="card-travel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{review.guest} • {review.property}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <div className="mt-3">
                      <button
                        onClick={() => handleOpenReply(`review-${review.id}`)}
                        className="btn-outline-primary text-xs py-1.5 px-3"
                      >
                        Reply
                      </button>
                      {activeReplyTarget === `review-${review.id}` && (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={replyTextByTarget[`review-${review.id}`] || ""}
                            onChange={(e) => setReplyTextByTarget((prev) => ({ ...prev, [`review-${review.id}`]: e.target.value }))}
                            className="input-search w-full"
                            placeholder="Type your reply"
                          />
                          <button
                            onClick={() => handleSendReply(`review-${review.id}`, review.guest)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Messages</h2>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="card-travel p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{message.from}</p>
                      <p className="text-sm text-muted-foreground">{message.text}</p>
                      {activeReplyTarget === `message-${message.id}` && (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={replyTextByTarget[`message-${message.id}`] || ""}
                            onChange={(e) => setReplyTextByTarget((prev) => ({ ...prev, [`message-${message.id}`]: e.target.value }))}
                            className="input-search w-full"
                            placeholder="Type your reply"
                          />
                          <button
                            onClick={() => handleSendReply(`message-${message.id}`, message.from)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-2">{message.time}</p>
                      <button onClick={() => handleOpenReply(`message-${message.id}`)} className="btn-outline-primary text-xs py-1.5 px-3">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Profile Settings</h2>
              <div className="card-travel p-6 max-w-xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={hostAvatar || "https://i.pravatar.cc/150"}
                    alt="Host"
                    className="w-16 h-16 rounded-2xl object-cover border border-border"
                  />
                  <label className="btn-outline-primary text-sm py-1.5 px-3 cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div className="space-y-3">
                  <input value={hostName} onChange={(e) => setHostName(e.target.value)} className="input-search w-full" placeholder="Name" />
                  <input value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} className="input-search w-full" placeholder="Email" />
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={handleSaveProfile} className="btn-primary text-sm py-1.5">Save</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isAddingProperty && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-5">
              <h3 className="text-lg font-bold text-foreground mb-4">Add New Property</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newPropertyName} onChange={(e) => setNewPropertyName(e.target.value)} className="input-search w-full md:col-span-2" placeholder="Property name" />
                <input value={newPropertyLocation} onChange={(e) => setNewPropertyLocation(e.target.value)} className="input-search w-full" placeholder="Location" />
                <input type="number" value={newPropertyPrice} onChange={(e) => setNewPropertyPrice(Number(e.target.value) || 0)} className="input-search w-full" placeholder="Price per night" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsAddingProperty(false)} className="btn-outline-primary text-sm py-1.5">Cancel</button>
                <button onClick={handleAddProperty} className="btn-primary text-sm py-1.5">Save Property</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
