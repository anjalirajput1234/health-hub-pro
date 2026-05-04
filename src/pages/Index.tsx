import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, ShieldCheck, Sparkles, Activity, Clock4, Stethoscope, Calendar, Video, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { MOCK_DOCTORS, SPECIALIZATIONS } from "@/lib/mock-data";
import { DoctorCard } from "@/components/doctor-card";
import { Reveal, Stagger, staggerItem, CountUp } from "@/components/animations";
import heroImg from "@/assets/hero-doctor.jpg";

const stats = [
  { num: 12500, suffix: "+", label: "Verified Doctors" },
  { num: 120, suffix: "+", label: "Cities Covered" },
  { num: 1200000, suffix: "+", label: "Happy Patients" },
  { num: 48, suffix: "/5", label: "Avg. Rating", divider: 10 },
];

const steps = [
  { icon: SearchIcon, title: "Search", desc: "Find verified doctors by specialty, location or condition.", color: "from-primary to-primary-glow" },
  { icon: Calendar, title: "Book", desc: "Pick a slot that suits you and confirm in seconds.", color: "from-secondary to-accent" },
  { icon: Video, title: "Consult", desc: "Visit the clinic or join a secure video consultation.", color: "from-accent to-primary" },
];

const testimonials = [
  { name: "Anjali R.", text: "Booked a cardiologist in 30 seconds. The video consult was seamless.", role: "Mumbai" },
  { name: "Rohit S.", text: "Loved the AI symptom checker — pointed me to the right specialist.", role: "Delhi" },
  { name: "Meena K.", text: "Verified profiles and real reviews gave me confidence to book.", role: "Bengaluru" },
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

        {/* Subtle particle pattern */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -40, -80] }}
            transition={{ duration: 5 + (i % 3), delay: i * 0.5, repeat: Infinity }}
            style={{ left: `${(i * 47) % 95}%`, top: `${20 + (i % 5) * 12}%` }}
          />
        ))}

        <div className="container relative mx-auto pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium shadow-card">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Now serving 120+ cities across India
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
                Quality healthcare,{" "}
                <span className="gradient-text">one tap away.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Discover trusted doctors near you, read verified reviews, and book confirmed appointments in seconds.
              </p>

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
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative max-w-md mx-auto lg:max-w-none w-full"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border shadow-elevated">
                <img src={heroImg} alt="Trusted doctor" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-3 top-8 glass rounded-2xl p-3 w-52 hidden sm:block"
              >
                <p className="text-xs text-muted-foreground">Next available</p>
                <p className="font-display font-semibold text-sm">Dr. Priya Mehta</p>
                <p className="text-xs text-secondary mt-0.5">● Today, 4:30 PM</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 bottom-8 glass rounded-2xl p-3 w-48 hidden sm:block"
              >
                <p className="text-xs text-muted-foreground">Rated by 1,284</p>
                <p className="font-display font-bold text-lg">4.9 ★</p>
                <p className="text-xs text-muted-foreground">past 30 days</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="container mx-auto py-12">
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold">Browse by specialty</h2>
              <p className="text-muted-foreground text-sm">Find the right expert for your concern.</p>
            </div>
            <Link to="/doctors" className="text-sm font-medium text-primary hidden sm:inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
        <Stagger className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
          {SPECIALIZATIONS.map((s) => (
            <motion.div key={s.name} variants={staggerItem}>
              <Link
                to={`/doctors?spec=${encodeURIComponent(s.name)}`}
                className="shrink-0 w-28 sm:w-32 rounded-2xl border border-border bg-card p-4 grid place-items-center text-center hover-lift block"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <span className="text-xs font-medium">{s.name}</span>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section className="container mx-auto py-16">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold">How it works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to better care.</p>
          </div>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={staggerItem} className="relative rounded-3xl border border-border bg-card p-7 hover-lift">
              <div className={`absolute -top-px right-6 text-7xl font-display font-bold opacity-5`}>{i + 1}</div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center shadow-glow`}>
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-display font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Featured doctors */}
      <section className="container mx-auto py-12">
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold">Featured doctors</h2>
              <p className="text-muted-foreground text-sm">Top-rated practitioners booking today.</p>
            </div>
            <Button variant="outline" asChild className="rounded-full hidden sm:inline-flex">
              <Link to="/doctors">See all <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((d) => (
            <motion.div key={d.id} variants={staggerItem}>
              <DoctorCard doctor={d} />
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Stats */}
      <section className="container mx-auto py-16">
        <Reveal>
          <div className="rounded-3xl bg-gradient-hero p-8 sm:p-12 text-primary-foreground relative overflow-hidden shadow-elevated">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-display font-bold">
                    {s.divider
                      ? <><CountUp to={s.num / s.divider} />{s.suffix}</>
                      : <CountUp to={s.num} suffix={s.suffix} />}
                  </div>
                  <div className="text-sm opacity-90 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto py-12">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold">Loved by patients</h2>
            <p className="text-muted-foreground mt-2">Real stories from real users.</p>
          </div>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={staggerItem} className="rounded-2xl border border-border bg-card p-6 hover-lift">
              <p className="text-warning text-lg">★★★★★</p>
              <p className="mt-3 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold">{t.name[0]}</div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-12 pb-20">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center shadow-card">
            <div>
              <Stethoscope className="w-10 h-10 text-primary mb-3" />
              <h3 className="text-2xl font-display font-bold">Are you a healthcare professional?</h3>
              <p className="text-muted-foreground mt-2">Join 12,500+ verified doctors growing their practice on DoctorKhoj.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild className="rounded-full bg-gradient-primary border-0 shadow-glow"><Link to="/register">List your practice</Link></Button>
              <Button asChild variant="outline" className="rounded-full"><Link to="/symptom-checker">Try AI checker</Link></Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
