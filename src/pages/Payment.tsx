import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { homestays } from "@/lib/mockData";
import { Shield, CheckCircle, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export default function Payment() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const homestay = homestays.find((h) => h.id === id) || homestays[0];

  const amount = Number(searchParams.get("amount")) || homestay.price * 2;
  const nights = Number(searchParams.get("nights")) || 2;
  const checkIn = searchParams.get("checkin") || "";
  const checkOut = searchParams.get("checkout") || "";

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const handlePay = async () => {
    if (method === "card") {
      if (!cardNum.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim()) {
        toast.error("Please fill all card details.");
        return;
      }

      if (cardNum.replace(/\s/g, "").length !== 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return;
      }

      if (!/^\d{2}\s?\/\s?\d{2}$/.test(cardExpiry.trim())) {
        toast.error("Please enter expiry in MM / YY format.");
        return;
      }

      if (!/^\d{3}$/.test(cardCvv.trim())) {
        toast.error("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    if (method === "upi") {
      if (!upiId.trim()) {
        toast.error("Please fill UPI ID.");
        return;
      }

      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(upiId.trim())) {
        toast.error("Please enter a valid UPI ID.");
        return;
      }
    }

    if ((method === "netbanking" || method === "wallet") && !selectedProvider) {
      toast.error(`Please select a ${method === "netbanking" ? "bank" : "wallet"} provider.`);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Booking Confirmed! 🎉
          </h1>
          <p className="text-muted-foreground mb-2">{homestay.name}</p>
          <p className="text-muted-foreground text-sm mb-6">{checkIn} → {checkOut} · {nights} nights</p>
          <div className="bg-muted/50 rounded-2xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-bold text-foreground">SV{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-bold text-primary">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-foreground capitalize">{method}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/tourist-dashboard")} className="btn-primary flex-1">
              View My Bookings
            </button>
            <button onClick={() => window.print()} className="btn-outline-primary flex-1">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <h1 className="text-2xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Complete Payment
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Payment Methods */}
              <div className="card-travel p-5">
                <h3 className="font-bold text-foreground mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        method === m.id ? "border-primary bg-primary/8 text-primary" : "border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      <m.icon className="h-4 w-4" /> {m.label}
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Card Number</label>
                      <input
                        className="input-search w-full font-mono"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNum}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardNum(v.replace(/(.{4})/g, "$1 ").trim());
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Expiry</label>
                        <input
                          className="input-search w-full"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          maxLength={7}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">CVV</label>
                        <input
                          className="input-search w-full"
                          placeholder="•••"
                          maxLength={3}
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Name on Card</label>
                      <input
                        className="input-search w-full"
                        placeholder="As on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {method === "upi" && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">UPI ID</label>
                    <input
                      className="input-search w-full"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Supports Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                )}
                {(method === "netbanking" || method === "wallet") && (
                  <div className="grid grid-cols-3 gap-2">
                    {(method === "netbanking"
                      ? ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"]
                      : ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"]
                    ).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedProvider(opt)}
                        className={`p-3 border rounded-xl text-sm transition-colors text-foreground font-medium ${selectedProvider === opt ? "border-primary bg-primary/8 text-primary" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-secondary flex-shrink-0" />
                <span>Your payment is secured with 256-bit SSL encryption. We never store your card details.</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>🔒 Pay ₹{amount.toLocaleString()} Securely</>
                )}
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="card-travel p-5 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-36 object-cover rounded-xl mb-4"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80"; }}
                />
                <h4 className="font-bold text-foreground">{homestay.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{homestay.location} · {nights} nights</p>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between text-foreground">
                    <span>₹{homestay.price.toLocaleString()} × {nights} nights</span>
                    <span>₹{(homestay.price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & Fees</span>
                    <span>₹{(amount - homestay.price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-primary">₹{amount.toLocaleString()}</span>
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
