import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { homestays } from "@/lib/mockData";
import { Shield, ChevronLeft, MapPin, Calendar, Users, Star, CheckCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const homestay = homestays.find((h) => h.id === id) || homestays[0];
  const checkIn = searchParams.get("checkin") || "";
  const checkOut = searchParams.get("checkout") || "";
  const guests = Number(searchParams.get("guests")) || 2;

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 2;

  const subtotal = nights * homestay.price;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleProceedToPayment = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please fill check-in and check-out dates.");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill all guest details before payment.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please accept terms and conditions.");
      return;
    }

    navigate(`/payment/${id}?amount=${total}&nights=${nights}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <Link to={`/homestay/${id}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to property
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Confirm your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - Booking Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Homestay Summary */}
              <div className="card-travel p-5 flex gap-4">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80"; }}
                />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{homestay.category}</p>
                  <h2 className="font-bold text-foreground">{homestay.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {homestay.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-semibold text-foreground">{homestay.rating}</span>
                    <span className="text-xs text-muted-foreground">({homestay.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="card-travel p-5">
                <h3 className="font-bold text-foreground mb-4">Trip Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Check In</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{checkIn || "Not selected"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Check Out</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{checkOut || "Not selected"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Guests</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{guests} {guests === 1 ? "guest" : "guests"}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span><strong className="text-foreground">{nights} nights</strong> · ₹{homestay.price.toLocaleString()}/night</span>
                </div>
              </div>

              {/* Guest Info */}
              <div className="card-travel p-5">
                <h3 className="font-bold text-foreground mb-4">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">First Name</label>
                    <input
                      type="text"
                      className="input-search w-full"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Last Name</label>
                    <input
                      type="text"
                      className="input-search w-full"
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email</label>
                    <input
                      type="email"
                      className="input-search w-full"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Phone</label>
                    <input
                      type="tel"
                      className="input-search w-full"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="card-travel p-5">
                <h3 className="font-bold text-foreground mb-2">Special Requests</h3>
                <p className="text-sm text-muted-foreground mb-3">Let your host know about any special needs or requests</p>
                <textarea
                  className="input-search w-full h-24 resize-none"
                  placeholder="Eg: Early check-in, vegetarian food, baby cot required..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* Cancellation */}
              <div className="card-travel p-5 border-l-4 border-l-secondary">
                <h3 className="font-bold text-foreground mb-2">Cancellation Policy</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" /> Free cancellation up to 48 hours before check-in</div>
                  <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" /> 50% refund for cancellation within 48 hours</div>
                  <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" /> No refund for same-day cancellation</div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the <Link to="/" className="text-primary hover:underline">Terms & Conditions</Link> and{" "}
                  <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>. I confirm my stay details are correct.
                </span>
              </label>

              <button
                onClick={handleProceedToPayment}
                disabled={!agreeToTerms}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Payment · ₹{total.toLocaleString()}
              </button>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-2">
              <div className="card-travel p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-5">Price Breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-foreground">
                    <span>₹{homestay.price.toLocaleString()} × {nights} nights</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cleaning fee</span>
                    <span>₹200</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>StayVista service fee</span>
                    <span>₹{Math.round(subtotal * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (12%)</span>
                    <span>₹{taxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
                    <span>Total (INR)</span>
                    <span className="text-primary">₹{(total + 200 + Math.round(subtotal * 0.05)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-secondary" />
                    <span>Your payment is protected by our secure booking guarantee</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Have a coupon?</p>
                  <div className="flex gap-2">
                    <input type="text" className="input-search flex-1 text-sm py-2" placeholder="Enter coupon code" />
                    <button className="btn-outline-primary text-sm py-2 px-3">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
