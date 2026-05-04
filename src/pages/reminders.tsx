import { useState } from "react";
import { useReminders } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pill, Plus, Trash2, Clock } from "lucide-react";
import { Reveal } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ALL_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function Reminders() {
  const { items, add, toggle, remove } = useReminders();
  const [med, setMed] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("09:00");
  const [days, setDays] = useState<string[]>(["M", "T", "W", "T", "F", "S", "S"]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!med) return toast.error("Enter medicine name");
    add({ medicine: med, dosage: dose || "1 tablet", time, days });
    setMed(""); setDose("");
    toast.success("Reminder added");
  };

  const toggleDay = (idx: number, d: string) => {
    setDays((prev) => prev.includes(`${idx}-${d}`) ? prev.filter((x) => x !== `${idx}-${d}`) : [...prev, `${idx}-${d}`]);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Medicine Reminders</h1>
        <p className="text-muted-foreground text-sm mb-6">Never miss a dose.</p>
      </Reveal>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card mb-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2"><Plus className="w-4 h-4" />Add reminder</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="med">Medicine</Label>
            <Input id="med" value={med} onChange={(e) => setMed(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="e.g. Paracetamol 500mg" />
          </div>
          <div>
            <Label htmlFor="dose">Dosage</Label>
            <Input id="dose" value={dose} onChange={(e) => setDose(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="1 tablet" />
          </div>
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 rounded-xl h-11 w-40" />
        </div>
        <Button type="submit" className="rounded-full bg-gradient-primary border-0 shadow-glow"><Plus className="w-4 h-4 mr-1" />Add reminder</Button>
      </form>

      <h3 className="font-display font-semibold mb-3">Active reminders ({items.filter((i) => i.active).length})</h3>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Pill className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No reminders yet</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {items.map((r) => (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }}
                className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary grid place-items-center"><Pill className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold truncate">{r.medicine}</p>
                  <p className="text-xs text-muted-foreground">{r.dosage} • <Clock className="w-3 h-3 inline -mt-0.5" /> {r.time}</p>
                </div>
                <Switch checked={r.active} onCheckedChange={() => toggle(r.id)} />
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
