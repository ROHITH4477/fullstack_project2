import { Link } from "react-router-dom";
import { Star, MapPin, Wifi, Heart, Users, Utensils } from "lucide-react";
import { useState } from "react";
const amenityIcons = {
  WiFi: <Wifi className="h-3.5 w-3.5"/>,
  "Home Food": <Utensils className="h-3.5 w-3.5"/>,
  Breakfast: <Utensils className="h-3.5 w-3.5"/>,
};
export default function HomestayCard({ homestay, variant = "default" }) {
    const [wishlisted, setWishlisted] = useState(false);
    return (<div className="card-travel group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img src={homestay.image} alt={homestay.name} className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80";
        }}/>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-card/85 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
            {homestay.category}
          </span>
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }} className="absolute top-3 right-3 w-9 h-9 bg-card/85 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center hover:scale-110 hover:-rotate-6 transition-all duration-300">
          <Heart className={`h-4.5 w-4.5 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}/>
        </button>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          ₹{homestay.price.toLocaleString()}/night
        </div>
      </div>

      {/* Content */}
      <Link to={`/homestay/${homestay.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-300">
            {homestay.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent"/>
            <span className="text-sm font-semibold text-foreground">{homestay.rating}</span>
            <span className="text-xs text-muted-foreground">({homestay.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 flex-shrink-0"/>
          <span className="text-xs truncate">{homestay.location}</span>
          <span className="text-xs text-muted-foreground/60 ml-auto flex-shrink-0">• {homestay.distance}</span>
        </div>

        {variant !== "compact" && (<p className="text-xs text-muted-foreground mb-3 line-clamp-2">{homestay.description}</p>)}

        {/* Amenities */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="tag-amenity">
            <Users className="h-3.5 w-3.5"/> {homestay.guests} guests
          </div>
          {homestay.amenities.slice(0, 2).map((a) => (<div key={a} className="tag-amenity">
              {amenityIcons[a] || <span className="text-[10px]">✓</span>}
              {a}
            </div>))}
          {homestay.amenities.length > 2 && (<div className="tag-amenity">+{homestay.amenities.length - 2} more</div>)}
        </div>
      </Link>
    </div>);
}
