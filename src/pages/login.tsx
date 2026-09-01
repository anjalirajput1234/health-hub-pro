import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Stethoscope, Shield, Sparkles, Heart, Activity, ChevronDown, Star, CheckCircle2, Users, Calendar, Award, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { authErrorMessage, configError, withRetry } from "@/lib/auth-errors";

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
    const cfg = configError();
    if (cfg) return toast.error(cfg);
    setLoading(true);
    try {
      const { error } = await withRetry(() => supabase.auth.signInWithPassword({ email: email.trim(), password }));
      if (error) throw error;
      toast.success("Welcome back!");
      nav(from, { replace: true });
    } catch (err: any) {
      toast.error(await authErrorMessage(err, "login"));
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
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-10 w-80 h-80 rounded-full bg-white/25 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 -right-10 w-[28rem] h-[28rem] rounded-full bg-accent/40 blur-3xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full border border-white/10"
          />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
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

        {/* Top brand bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-6 text-primary-foreground"
        >
          <div className="inline-flex items-center gap-2 font-display font-bold">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md grid place-items-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            DoctorKhoj
          </div>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            Sign up
          </Link>
        </motion.div>

        <div className="relative z-10 flex-1 grid lg:grid-cols-[1.2fr_1fr] items-center gap-10 px-6 sm:px-10 py-10 lg:py-16 max-w-7xl mx-auto w-full">
          {/* Left content */}
          <div className="text-primary-foreground text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              India's most trusted health platform
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.05]"
            >
              Your health,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">simplified.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute left-0 bottom-1 h-3 w-full bg-accent/50 rounded-full origin-left -z-0"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-5 text-base sm:text-lg opacity-90 max-w-xl mx-auto lg:mx-0"
            >
              Book verified doctors, get instant video consultations, and manage your family's health — all in one beautiful app.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2 text-sm"
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
                  transition={{ delay: 0.9 + idx * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20"
                >
                  <f.i className="w-3.5 h-3.5" /> {f.t}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
            >
              <Button
                onClick={scrollToForm}
                className="h-12 px-7 rounded-full bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated"
              >
                Get started free
              </Button>
              <Button
                variant="outline"
                onClick={scrollToForm}
                className="h-12 px-7 rounded-full bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground font-medium"
              >
                I already have an account
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm"
            >
              <div className="flex -space-x-2">
                {["A", "R", "M", "S"].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-white to-accent/60 border-2 border-primary grid place-items-center text-primary font-bold text-xs">
                    {c}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning">
                  {[0,1,2,3,4].map(i => <Star key={i} className="w-3.5 h-3.5 fill-warning" />)}
                  <span className="text-primary-foreground ml-1 font-semibold">4.9</span>
                </div>
                <div className="text-xs opacity-80">from 1.2M+ patients</div>
              </div>
            </motion.div>
          </div>

          {/* Right visual: floating cards */}
          <div className="relative hidden lg:block h-[520px]">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 rounded-full border-2 border-dashed border-white/20"
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/15 backdrop-blur-2xl border border-white/30 grid place-items-center shadow-elevated"
            >
              <Heart className="w-16 h-16 text-primary-foreground" fill="currentColor" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
              transition={{ x: { delay: 0.6 }, opacity: { delay: 0.6 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-4 left-0 glass-strong rounded-2xl p-4 w-56 text-foreground"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next appointment</p>
                  <p className="font-display font-semibold text-sm">Today, 4:30 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
              transition={{ x: { delay: 0.8 }, opacity: { delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-16 right-0 glass-strong rounded-2xl p-4 w-52 text-foreground"
            >
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium">Video consult</p>
                <span className="ml-auto w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground">Dr. Priya Mehta is online</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{ opacity: { delay: 1 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
              className="absolute bottom-16 left-4 glass-strong rounded-2xl p-4 w-60 text-foreground"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 grid place-items-center">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">Prescription ready</p>
                  <p className="text-xs text-muted-foreground">Tap to download</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ opacity: { delay: 1.2 }, y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
              className="absolute bottom-4 right-4 glass-strong rounded-2xl p-4 w-44 text-foreground"
            >
              <Award className="w-5 h-5 text-warning mb-2" />
              <p className="text-2xl font-display font-bold">12,500+</p>
              <p className="text-xs text-muted-foreground">verified doctors</p>
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="relative z-10 mx-6 sm:mx-10 mb-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-4 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-primary-foreground"
        >
          {[
            { i: Users, n: "1.2M+", l: "Patients" },
            { i: Stethoscope, n: "12.5K+", l: "Doctors" },
            { i: Calendar, n: "50K+", l: "Bookings/mo" },
            { i: Award, n: "4.9★", l: "Rating" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <s.i className="w-5 h-5 opacity-80 shrink-0" />
              <div>
                <div className="font-display font-bold text-lg leading-tight">{s.n}</div>
                <div className="text-xs opacity-80">{s.l}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity } }}
          onClick={scrollToForm}
          className="relative z-10 mx-auto mb-6 inline-flex flex-col items-center gap-1 text-xs text-primary-foreground/80 hover:text-primary-foreground"
        >
          Scroll to sign in
          <ChevronDown className="w-5 h-5" />
        </motion.button>
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
