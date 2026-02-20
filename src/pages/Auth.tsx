import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Home, ArrowLeft, User, Building, Map, Shield } from "lucide-react";
import heroImg from "@/assets/hero-bg.jpg";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const roles = [
  {
    id: "tourist" as UserRole,
    label: "Tourist",
    icon: User,
    desc: "Explore & book homestays",
    emoji: "🧳",
    color: "border-blue-300 bg-blue-50 text-blue-700",
    activeColor: "border-primary bg-primary/10 text-primary",
  },
  {
    id: "host" as UserRole,
    label: "Homestay Host",
    icon: Building,
    desc: "List & manage your property",
    emoji: "🏡",
    color: "border-border bg-muted text-foreground",
    activeColor: "border-primary bg-primary/10 text-primary",
  },
  {
    id: "guide" as UserRole,
    label: "Local Guide",
    icon: Map,
    desc: "Share local knowledge & guide",
    emoji: "🧭",
    color: "border-border bg-muted text-foreground",
    activeColor: "border-primary bg-primary/10 text-primary",
  },
  {
    id: "admin" as UserRole,
    label: "Admin",
    icon: Shield,
    desc: "Manage users & approvals",
    emoji: "🛡️",
    color: "border-border bg-muted text-foreground",
    activeColor: "border-primary bg-primary/10 text-primary",
  },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isLoggedIn, user } = useAuth();

  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [selectedRole, setSelectedRole] = useState<UserRole>("tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      switch (user.role) {
        case "host": navigate("/host-dashboard"); break;
        case "guide": navigate("/guide-dashboard"); break;
        case "admin": navigate("/admin-dashboard"); break;
        default: navigate("/tourist-dashboard");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup({ name: form.name, email: form.email, password: form.password, role: selectedRole, phone: form.phone });
      } else {
        await login(form.email, form.password, selectedRole);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImg}
          alt="StayVista"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 via-primary/50 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-warm rounded-xl flex items-center justify-center shadow">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>StayVista</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your next unforgettable journey begins here
            </h2>
            <p className="text-white/75 mb-8">
              Join thousands of travellers, hosts, and guides creating authentic experiences across India.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Verified Stays", val: "1,200+" },
                { label: "Happy Guests", val: "50K+" },
                { label: "Expert Guides", val: "350+" },
                { label: "Destinations", val: "340+" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xl font-bold text-white">{s.val}</div>
                  <div className="text-white/70 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>StayVista</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isSignup ? "Create your account" : "Welcome back!"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignup ? "Join India's leading homestay community" : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">I am a...</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/8 shadow-md scale-[1.02]"
                      : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xl block mb-1">{role.emoji}</span>
                  <span className={`text-xs font-semibold block ${selectedRole === role.id ? "text-primary" : "text-foreground"}`}>
                    {role.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-search w-full"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="input-search w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  className="input-search w-full"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-search w-full pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="input-search w-full"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
            )}

            {!isSignup && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isSignup ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                isSignup ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Social */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">or continue with</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 hover:bg-muted transition-colors text-sm font-medium text-foreground">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Secure notice */}
          <div className="flex items-center gap-2 mt-4 justify-center text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secure & encrypted. We never share your data.</span>
          </div>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
