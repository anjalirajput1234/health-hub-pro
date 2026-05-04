import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RotateCcw, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/animations";

type Q = { q: string; options: { label: string; tags: string[] }[] };

const questions: Q[] = [
  {
    q: "Where is the discomfort most felt?",
    options: [
      { label: "Head / face", tags: ["Neurology", "ENT"] },
      { label: "Chest / heart", tags: ["Cardiology", "General Physician"] },
      { label: "Stomach / abdomen", tags: ["General Physician", "Gastro"] },
      { label: "Joints / bones", tags: ["Orthopedic"] },
      { label: "Skin / hair", tags: ["Dermatology"] },
    ],
  },
  {
    q: "How long have you had symptoms?",
    options: [
      { label: "Less than a day", tags: ["General Physician"] },
      { label: "2-7 days", tags: ["General Physician"] },
      { label: "More than a week", tags: ["specialist"] },
    ],
  },
  {
    q: "Severity right now?",
    options: [
      { label: "Mild", tags: [] },
      { label: "Moderate", tags: [] },
      { label: "Severe", tags: ["urgent"] },
    ],
  },
];

export default function SymptomChecker() {
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const reset = () => { setStep(0); setTags([]); setDone(false); };
  const choose = (t: string[]) => {
    const next = [...tags, ...t];
    if (step + 1 >= questions.length) { setTags(next); setDone(true); }
    else { setTags(next); setStep(step + 1); }
  };

  const recommended = (() => {
    const counts: Record<string, number> = {};
    tags.forEach((t) => { if (t !== "urgent" && t !== "specialist") counts[t] = (counts[t] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "General Physician";
  })();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Reveal>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium shadow-card">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> AI-assisted (not a diagnosis)
          </span>
          <h1 className="text-3xl font-display font-bold mt-3">Symptom Checker</h1>
        </div>
      </Reveal>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>Question {step + 1} of {questions.length}</span>
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
              <h2 className="text-xl font-display font-semibold mt-3">{questions[step].q}</h2>
              <div className="mt-5 grid gap-2">
                {questions[step].options.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => choose(o.tags)}
                    className="text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                  >
                    <span className="font-medium">{o.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/15 grid place-items-center mb-4">
                <Stethoscope className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-display font-bold">Recommended specialty</h2>
              <p className="text-3xl font-display font-bold gradient-text mt-2">{recommended}</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                {tags.includes("urgent")
                  ? "Symptoms appear severe. Please seek care immediately or visit the nearest hospital."
                  : "Based on your answers, we suggest consulting the specialty above."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Button asChild className="rounded-full bg-gradient-primary border-0 shadow-glow">
                  <Link to={`/doctors?spec=${recommended}`}>Find {recommended} <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
                <Button variant="outline" className="rounded-full" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" />Restart</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
