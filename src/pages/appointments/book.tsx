import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MOCK_DOCTORS } from "@/lib/mock-data";
import { useAppointments, useLoyalty, usePayments, useNotifs } from "@/store/app";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});
const slots = ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:30 PM", "05:30 PM", "06:30 PM"];

export default function Book() {
  const { doctorId } = useParams();
  const nav = useNavigate();
  const doc = MOCK_DOCTORS.find((d) => d.id === doctorId) || MOCK_DOCTORS[0];
  const addAppt = useAppointments((s) => s.add);
  const addPoints = useLoyalty((s) => s.add);
  const addPayment = usePayments((s) => s.add);
  const addNotif = useNotifs((s) => s.add);

  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [mode, setMode] = useState("clinic");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) { toast.error("Please pick a time slot"); return; }
    if (!name || !phone) { toast.error("Please enter your name and phone"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    addAppt({
      doctorId: doc.id, doctorName: doc.name, doctorPhoto: doc.photo,
      specialization: doc.specialization, date: days[day].toISOString(), time: slot,
      mode: mode as "clinic" | "video", feeINR: doc.feeINR, hospital: doc.hospital,
    });
    addPayment({ description: `Consultation • ${doc.name}`, amount: doc.feeINR, date: new Date().toISOString(), status: "paid", method: "UPI" });
    addPoints(50);
    addNotif({ title: "Appointment confirmed", body: `${doc.name} on ${days[day].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${slot}`, kind: "appointment" });
    setSubmitting(false);
    setDone(true);
    toast.success("Appointment confirmed! +50 loyalty points");
  };

  if (done) {
    return (
      <div className="container mx-auto py-16 max-w-md text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 grid place-items-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-display font-bold">You're all set!</h1>
          <p className="text-muted-foreground mt-2">Your appointment with <span className="font-medium text-foreground">{doc.name}</span> is confirmed for {days[day].toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })} at <span className="font-medium text-foreground">{slot}</span>.</p>
          <div className="mt-8 flex flex-col gap-2">
            <Button asChild className="rounded-full bg-gradient-primary border-0"><Link to="/dashboard">View my bookings</Link></Button>
            <Button asChild variant="outline" className="rounded-full"><Link to="/doctors">Find another doctor</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="mb-4 -ml-2"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>

      <h1 className="text-3xl font-display font-bold mb-2">Book an appointment</h1>
      <p className="text-muted-foreground mb-6 text-sm">Confirm your slot in less than a minute.</p>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-card mb-6 flex items-center gap-4">
        <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
        <div className="min-w-0">
          <p className="font-display font-semibold">{doc.name}</p>
          <p className="text-sm text-primary">{doc.specialization}</p>
          <p className="text-xs text-muted-foreground">{doc.hospital} • {doc.city}</p>
        </div>
        <p className="ml-auto font-display font-bold">₹{doc.feeINR}</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Select date</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
            {days.map((d, i) => (
              <button type="button" key={i} onClick={() => setDay(i)} className={`shrink-0 w-16 py-3 rounded-xl border text-center transition-all ${i === day ? "border-primary bg-primary/10 text-primary scale-105" : "border-border hover:border-primary/40"}`}>
                <p className="text-[10px] uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</p>
                <p className="text-lg font-display font-bold">{d.getDate()}</p>
                <p className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en", { month: "short" })}</p>
              </button>
            ))}
          </div>
          <h3 className="text-sm font-medium mt-5 mb-2">Available time slots</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {slots.map((s) => (
                <motion.button
                  layout type="button" key={s} onClick={() => setSlot(s)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${slot === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}
                >{s}</motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display font-semibold mb-4">Consultation mode</h2>
          <RadioGroup value={mode} onValueChange={setMode} className="grid sm:grid-cols-2 gap-3">
            {[
              { v: "clinic", t: "In-clinic visit", d: `${doc.hospital}, ${doc.city}` },
              { v: "video", t: "Video consultation", d: "Connect from anywhere" },
            ].map((o) => (
              <Label key={o.v} htmlFor={o.v} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${mode === o.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <RadioGroupItem id={o.v} value={o.v} />
                <div>
                  <p className="font-medium">{o.t}</p>
                  <p className="text-xs text-muted-foreground">{o.d}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Patient details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="+91 9000000000" />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Reason for visit (optional)</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5 rounded-xl" rows={3} placeholder="Briefly describe your symptoms…" />
          </div>
        </section>

        <Button disabled={submitting} className="w-full h-12 rounded-xl bg-gradient-primary border-0 shadow-glow text-base font-semibold">
          {submitting ? "Confirming…" : `Confirm booking • ₹${doc.feeINR}`}
        </Button>
      </form>
    </div>
  );
}
