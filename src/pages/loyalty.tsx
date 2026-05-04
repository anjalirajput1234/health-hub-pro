import { useLoyalty } from "@/store/app";
import { Award, Gift, Sparkles, TrendingUp } from "lucide-react";
import { Reveal, CountUp } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tiers = [
  { name: "Silver", min: 0, color: "from-muted-foreground/40 to-muted-foreground/60" },
  { name: "Gold", min: 500, color: "from-warning to-yellow-500" },
  { name: "Platinum", min: 1500, color: "from-primary to-accent" },
];

const rewards = [
  { name: "₹100 off next consultation", cost: 200 },
  { name: "Free lab test", cost: 500 },
  { name: "1-month video consult pass", cost: 1000 },
];

export default function Loyalty() {
  const { points, add } = useLoyalty();
  const tier = [...tiers].reverse().find((t) => points >= t.min)!;
  const next = tiers.find((t) => t.min > points);
  const progress = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Loyalty Points</h1>
        <p className="text-muted-foreground text-sm mb-6">Earn points on every booking. Redeem for rewards.</p>
      </Reveal>

      <div className={`rounded-3xl bg-gradient-to-br ${tier.color} p-8 text-primary-foreground shadow-elevated relative overflow-hidden mb-6`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wider opacity-80">{tier.name} member</p>
          <p className="text-5xl font-display font-bold mt-1"><CountUp to={points} /> pts</p>
          {next && (
            <>
              <div className="mt-5 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs mt-2 opacity-90">{next.min - points} pts to {next.name}</p>
            </>
          )}
        </div>
      </div>

      <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Gift className="w-4 h-4" />Rewards</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {rewards.map((r) => (
          <div key={r.name} className="rounded-2xl border border-border bg-card p-5 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3"><Sparkles className="w-5 h-5" /></div>
            <p className="font-medium text-sm">{r.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.cost} pts</p>
            <Button
              size="sm"
              disabled={points < r.cost}
              onClick={() => { add(-r.cost); toast.success(`Redeemed: ${r.name}`); }}
              className="mt-3 w-full rounded-full bg-gradient-primary border-0"
            >
              Redeem
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border p-5 flex items-center gap-4">
        <TrendingUp className="w-5 h-5 text-secondary" />
        <p className="text-sm text-muted-foreground">Earn 50 pts per appointment booked. Bonus 100 pts on monthly check-ups.</p>
      </div>
    </div>
  );
}
