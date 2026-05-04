import { useState } from "react";
import { useLocation } from "wouter";
import {
  Stethoscope, Mail, User, Phone, Eye, EyeOff,
  Lock, ArrowRight, HeartPulse, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FEATURES = [
  "Book appointments with top doctors",
  "Get digital OPD parchi instantly",
  "Track your health history",
  "AI-powered symptom analysis",
  "Secure payment & records",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Login() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "", email: "", phone: "", password: "",
    bloodGroup: "", gender: "", dob: "",
  });

  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginForm.email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);

    setTimeout(() => {
      const stored = localStorage.getItem(`dkuser_${loginForm.email}`);
      if (stored) {
        const profile = JSON.parse(stored);
        login(profile);
        navigate("/dashboard");
      } else {
        setError("No account found with this email. Please sign up first.");
      }
      setLoading(false);
    }, 600);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signupForm.name.trim()) { setError("Please enter your full name."); return; }
    if (!signupForm.email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (signupForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    setTimeout(() => {
      const profile = {
        name: signupForm.name.trim(),
        email: signupForm.email.toLowerCase(),
        phone: signupForm.phone,
        dob: signupForm.dob,
        bloodGroup: signupForm.bloodGroup,
        gender: signupForm.gender,
        address: "",
        avatarColor: "",
      };
      localStorage.setItem(`dkuser_${profile.email}`, JSON.stringify(profile));
      login(profile);
      navigate("/dashboard");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary to-blue-700 text-white flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">DoctorKhoj</span>
          </div>
          <h2 className="text-3xl font-bold leading-snug mb-4">
            Your health,<br />our priority.
          </h2>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Palamu's #1 healthcare platform — find doctors, book appointments, and manage your health records all in one place.
          </p>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <HeartPulse className="w-6 h-6 text-blue-200" />
            <span className="font-semibold text-sm">Free to use</span>
          </div>
          <p className="text-xs text-blue-200 leading-relaxed">
            DoctorKhoj is completely free for patients. No hidden charges for searching, booking, or using the AI symptom checker.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary">DoctorKhoj</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? "Log In" : "Create Account"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
                <p className="text-slate-500 text-sm mt-1">Sign in to access your health dashboard</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-11 rounded-xl"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm font-medium text-slate-700 mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 rounded-xl"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
                {loading ? "Signing in..." : (<>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>)}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button type="button" onClick={() => setTab("signup")} className="text-primary font-semibold hover:underline">
                  Create one free
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                <p className="text-slate-500 text-sm mt-1">Join thousands of patients in Palamu</p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Rahul Kumar"
                      className="pl-10 h-11 rounded-xl"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11 rounded-xl"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 h-11 rounded-xl"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Date of Birth</Label>
                    <Input
                      type="date"
                      className="h-11 rounded-xl"
                      value={signupForm.dob}
                      onChange={(e) => setSignupForm((p) => ({ ...p, dob: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Gender</Label>
                    <select
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={signupForm.gender}
                      onChange={(e) => setSignupForm((p) => ({ ...p, gender: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Blood Group</Label>
                    <select
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={signupForm.bloodGroup}
                      onChange={(e) => setSignupForm((p) => ({ ...p, bloodGroup: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 chars"
                        className="pl-10 pr-10 h-11 rounded-xl"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
                {loading ? "Creating account..." : (<>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>)}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
