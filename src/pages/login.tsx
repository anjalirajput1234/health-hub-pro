import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Stethoscope, Shield, Sparkles, Heart, Activity, ChevronDown, Star, CheckCircle2, Users, Calendar, Award, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImg from "@/assets/login-hero.jpg";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      nav(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = () =>
    toast.info("Google sign-in UI ready — connect provider in Cloud settings.");

  const scrollToForm = () => document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-soft">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/30 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -100, -200],
              x: [0, (i % 2 ? 30 : -30), 0],
            }}
            transition={{ duration: 6 + (i % 4), delay: i * 0.4, repeat: Infinity }}
            style={{ left: `${(i * 53) % 100}%`, top: `${70 + (i % 3) * 8}%` }}
          />
        ))}

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-primary-foreground px-6 py-16 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-xl grid place-items-center shadow-elevated mb-6"
          >
            <Stethoscope className="w-10 h-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight"
          >
            DoctorKhoj
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-4 text-lg sm:text-xl opacity-90 max-w-md"
          >
            Premium healthcare for every Indian family — verified doctors, instant bookings, AI-powered care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm"
          >
            {[
              { i: Shield, t: "Verified Doctors" },
              { i: Sparkles, t: "AI Symptom Check" },
              { i: Heart, t: "Emergency Access" },
              { i: Activity, t: "24/7 Support" },
            ].map((f, idx) => (
              <motion.span
                key={f.t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20"
              >
                <f.i className="w-3.5 h-3.5" /> {f.t}
              </motion.span>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1.4, y: { duration: 2, repeat: Infinity } }}
            onClick={scrollToForm}
            className="mt-12 inline-flex flex-col items-center gap-1 text-sm opacity-80 hover:opacity-100"
          >
            Sign in to continue
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* FORM */}
      <section id="login-form" className="min-h-screen grid lg:grid-cols-2 items-stretch">
        <div className="hidden lg:block relative overflow-hidden">
          <img src={heroImg} alt="Doctor" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
            <p className="text-sm opacity-80">Trusted by</p>
            <p className="text-4xl font-display font-bold">1.2M+ patients</p>
            <p className="text-sm opacity-80 mt-1">across 120+ Indian cities</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md space-y-5"
          >
            <div>
              <h2 className="text-3xl font-display font-bold">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to manage your appointments and health.</p>
            </div>

            {[
              <div key="email">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl" placeholder="you@example.com" />
              </div>,
              <div key="pwd">
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input id="password" type={show ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pr-11" placeholder="••••••••" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <button type="button" onClick={() => toast.info("Password reset email coming soon")} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>,
            ].map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}>
                {node}
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <Button
                disabled={loading}
                className="relative w-full h-12 rounded-xl bg-gradient-primary border-0 shadow-glow text-base font-semibold overflow-hidden group hover:shadow-elevated transition-shadow"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 group-active:scale-150 rounded-full transition-all duration-500" />
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign in"}
              </Button>
            </motion.div>

            <div className="relative text-center">
              <div className="absolute inset-y-1/2 inset-x-0 border-t border-border" />
              <span className="relative bg-background px-3 text-xs text-muted-foreground">or continue with</span>
            </div>

            <Button type="button" variant="outline" onClick={googleSignIn} className="w-full h-12 rounded-xl gap-3">
              <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8c1.8-4.4 6.1-7.5 11.1-7.5 2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 13-5l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.2 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 5.1c-.4.3 6.5-4.7 6.5-14.8 0-1.2-.1-2.3-.4-3.5z"/></svg>
              Sign in with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              New to DoctorKhoj?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
