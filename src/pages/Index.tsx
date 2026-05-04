import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, ShieldCheck, Sparkles, Activity, Clock4, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_DOCTORS, SPECIALIZATIONS } from "@/lib/mock-data";
import { DoctorCard } from "@/components/doctor-card";

const stats = [
  { label: "Verified Doctors", value: "12,500+" },
  { label: "Cities Covered", value: "120+" },
  { label: "Happy Patients", value: "1.2M" },
  { label: "Avg. Rating", value: "4.8/5" },
];

export default function Index() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const featured = MOCK_DOCTORS.slice(0, 6);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-accent/20 blur-3xl" />

        <div className="container relative mx-auto pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium shadow-card">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Now serving 120+ cities across India
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
                Quality healthcare,{" "}
                <span className="gradient-text">one tap away.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Discover trusted doctors near you, read verified reviews, and book confirmed appointments in seconds. No queues. No friction.
              </p>

              {/* Floating search */}
              <motion.form
                onSubmit={submit}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="mt-8 glass-strong rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
              >
                <div className="flex items-center gap-2 px-3 sm:border-r border-border/60 flex-1">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search doctors, specialties, conditions…"
                    className="bg-transparent outline-none text-sm w-full py-2.5"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary" /> Daltonganj, Palamu
                </div>
                <Button type="submit" className="rounded-xl bg-gradient-primary border-0 shadow-glow h-11 px-6">
                  Search <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Verified profiles</span>
                <span className="inline-flex items-center gap-1.5"><Clock4 className="w-3.5 h-3.5 text-primary" /> Same-day slots</span>
                <span className="inline-flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-accent" /> AI symptom checker</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated">
                <img src="/hero-doctor.jpg" alt="Trusted doctor" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-10 glass rounded-2xl p-4 w-56"
              >
                <p className="text-xs text-muted-foreground">Next available</p>
                <p className="font-display font-semibold">Dr. Priya Mehta</p>
                <p className="text-xs text-secondary mt-1">● Today, 4:30 PM</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 bottom-12 glass rounded-2xl p-4 w-52"
              >
                <p className="text-xs text-muted-foreground">Rated by 1,284 patients</p>
                <p className="font-display font-semibold">4.9 ★</p>
                <p className="text-xs text-muted-foreground">in past 30 days</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="container mx-auto py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">Browse by specialty</h2>
            <p className="text-muted-foreground text-sm">Find the right expert for your concern.</p>
          </div>
          <Link to="/doctors" className="text-sm font-medium text-primary hidden sm:inline-flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
          {SPECIALIZATIONS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/doctors?spec=${encodeURIComponent(s.name)}`}
                className="shrink-0 w-28 sm:w-32 rounded-2xl border border-border bg-card p-4 grid place-items-center text-center hover-lift"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <span className="text-xs font-medium">{s.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured doctors */}
      <section className="container mx-auto py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">Featured doctors</h2>
            <p className="text-muted-foreground text-sm">Top-rated practitioners booking patients today.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full hidden sm:inline-flex">
            <Link to="/doctors">See all <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto py-16">
        <div className="rounded-3xl bg-gradient-hero p-8 sm:p-12 text-primary-foreground relative overflow-hidden shadow-elevated">
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-display font-bold">{s.value}</div>
                <div className="text-sm opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-12 pb-20">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center shadow-card">
          <div>
            <Stethoscope className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-2xl font-display font-bold">Are you a healthcare professional?</h3>
            <p className="text-muted-foreground mt-2">Join 12,500+ verified doctors growing their practice on DoctorKhoj.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild className="rounded-full bg-gradient-primary border-0 shadow-glow"><Link to="/login">List your practice</Link></Button>
            <Button asChild variant="outline" className="rounded-full"><Link to="/chatbot">Try AI symptom checker</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
