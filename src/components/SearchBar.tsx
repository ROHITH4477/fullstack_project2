import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, X } from "lucide-react";
import { INDIAN_LOCATIONS } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

export default function SearchBar({ variant = "hero" }: SearchBarProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.length > 1) {
      const filtered = INDIAN_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(location.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [location]);

  const handleDetectLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "Your Location";
            const state = data.address.state || "";
            setLocation(`${city}${state ? ", " + state : ""}`);
          } catch {
            setLocation("Current Location");
          } finally {
            setLoadingLocation(false);
          }
        },
        () => {
          setLocation("Location denied");
          setLoadingLocation(false);
        }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  const handleSearch = () => {
    navigate(`/homestays?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`);
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
          placeholder="Search homestays..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative md:col-span-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Where</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                ref={inputRef}
                className="input-search w-full pl-9 pr-9"
                placeholder="Search destination..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => location.length > 1 && setShowSuggestions(true)}
              />
              {location && (
                <button
                  onClick={() => { setLocation(""); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <button
                onClick={handleDetectLocation}
                className="absolute -bottom-6 left-0 text-xs text-primary hover:underline flex items-center gap-1"
              >
                {loadingLocation ? "Detecting..." : "📍 Use my location"}
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-8 left-0 right-0 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm flex items-center gap-2 transition-colors"
                    onClick={() => { setLocation(s); setShowSuggestions(false); }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check In */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                type="date"
                className="input-search w-full pl-9"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>

          {/* Check Out */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Check Out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                type="date"
                className="input-search w-full pl-9"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          {/* Guests + Search */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Guests</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <select
                  className="input-search w-full pl-9 appearance-none cursor-pointer"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
