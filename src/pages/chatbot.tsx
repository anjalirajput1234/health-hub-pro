import { useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "bot"; text: string };

const seed: Msg[] = [
  { role: "bot", text: "Hi! I'm your AI symptom checker. Tell me what you're feeling and I'll suggest possible specialties to consult." },
];

export default function Chatbot() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const user: Msg = { role: "user", text: input };
    setMsgs((m) => [...m, user]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: "Based on what you described, you may want to consult a General Physician. If symptoms persist beyond 48 hours, see a specialist." }]);
    }, 600);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium shadow-card">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Powered by AI
        </div>
        <h1 className="text-3xl font-display font-bold mt-3">AI Symptom Checker</h1>
        <p className="text-muted-foreground text-sm">Not a medical diagnosis. Always consult a doctor.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-card p-4 h-[500px] overflow-y-auto space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-muted"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your symptoms…" className="rounded-xl h-11" />
        <Button className="rounded-xl bg-gradient-primary border-0 h-11 px-5"><Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
}
