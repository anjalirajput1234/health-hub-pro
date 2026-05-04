import { useState } from "react";
import { useEmergency } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Plus, Trash2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const helplines = [
  { name: "Ambulance", phone: "108" },
  { name: "Police", phone: "100" },
  { name: "Women Helpline", phone: "1091" },
  { name: "Child Helpline", phone: "1098" },
];

export default function Emergency() {
  const { items, add, remove } = useEmergency();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length >= 3) return toast.error("Maximum 3 contacts");
    if (!name || !phone) return toast.error("Name and phone are required");
    add({ name, relation: relation || "Family", phone });
    setName(""); setRelation(""); setPhone("");
    toast.success("Contact added");
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-5 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
          <div>
            <h1 className="text-xl font-display font-bold text-destructive">Emergency Contacts</h1>
            <p className="text-sm text-muted-foreground">In an emergency, dial <a href="tel:108" className="font-semibold text-destructive">108</a> or use the contacts below.</p>
          </div>
        </div>
      </Reveal>

      <h3 className="font-display font-semibold mb-3">National helplines</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {helplines.map((h) => (
          <a key={h.phone} href={`tel:${h.phone}`} className="rounded-2xl border border-border bg-card p-4 text-center hover-lift">
            <Phone className="w-5 h-5 mx-auto text-destructive mb-2" />
            <p className="text-xs text-muted-foreground">{h.name}</p>
            <p className="font-display font-bold">{h.phone}</p>
          </a>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 mb-6 space-y-4">
        <h3 className="font-display font-semibold">Add personal contact ({items.length}/3)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 rounded-xl h-11" /></div>
          <div><Label>Relation</Label><Input value={relation} onChange={(e) => setRelation(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="Spouse" /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="+91…" /></div>
        </div>
        <Button type="submit" disabled={items.length >= 3} className="rounded-full bg-gradient-primary border-0 shadow-glow"><Plus className="w-4 h-4 mr-1" />Add</Button>
      </form>

      <AnimatePresence>
        <div className="space-y-3">
          {items.map((c) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.relation}</p>
              </div>
              <Button asChild className="rounded-full bg-destructive hover:bg-destructive/90 border-0">
                <a href={`tel:${c.phone}`}><Phone className="w-4 h-4 mr-1" />{c.phone}</a>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(c.id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
