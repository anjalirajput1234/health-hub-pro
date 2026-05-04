import { usePayments } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, IndianRupee, Plus } from "lucide-react";
import { Reveal, CountUp } from "@/components/animations";
import { toast } from "sonner";

const variant: Record<string, string> = {
  paid: "bg-secondary/15 text-secondary border-secondary/20",
  pending: "bg-warning/15 text-warning border-warning/20",
  refunded: "bg-muted text-muted-foreground",
};

export default function Payments() {
  const { items } = usePayments();
  const month = items
    .filter((p) => new Date(p.date).getMonth() === new Date().getMonth() && p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="container mx-auto py-8">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Payments & Billing</h1>
        <p className="text-muted-foreground text-sm mb-6">Track transactions, manage methods, download invoices.</p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 shadow-elevated">
          <p className="text-sm opacity-80">Spent this month</p>
          <p className="text-3xl font-display font-bold mt-1 flex items-center"><IndianRupee className="w-6 h-6" /><CountUp to={month} /></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total transactions</p>
          <p className="text-3xl font-display font-bold mt-1"><CountUp to={items.length} /></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Saved methods</p>
          <p className="text-3xl font-display font-bold mt-1">2</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Transactions</h3>
          </div>
          <div className="divide-y divide-border">
            {items.map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><CreditCard className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {p.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold flex items-center justify-end"><IndianRupee className="w-3.5 h-3.5" />{p.amount}</p>
                  <Badge className={variant[p.status] + " border mt-1 capitalize text-[10px]"}>{p.status}</Badge>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full" onClick={() => toast.success("Invoice downloaded")}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 h-fit">
          <h3 className="font-display font-semibold mb-3">Payment methods</h3>
          <div className="space-y-2">
            {[
              { brand: "Visa", last4: "4242", color: "from-primary to-primary-glow" },
              { brand: "UPI", last4: "@okaxis", color: "from-secondary to-accent" },
            ].map((c) => (
              <div key={c.last4} className={`rounded-xl p-4 text-primary-foreground bg-gradient-to-br ${c.color}`}>
                <p className="text-xs opacity-80">{c.brand}</p>
                <p className="text-lg font-display font-bold tracking-wider">•••• {c.last4}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl mt-2" onClick={() => toast.info("Add card flow coming soon")}>
              <Plus className="w-4 h-4 mr-1" />Add method
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
