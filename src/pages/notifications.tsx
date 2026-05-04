import { useNotifs } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Sparkles, Tag, CheckCheck } from "lucide-react";
import { Reveal } from "@/components/animations";
import { motion } from "framer-motion";

const iconFor = { appointment: Calendar, tip: Sparkles, offer: Tag } as const;

export default function Notifications() {
  const { items, markAllRead } = useNotifs();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Reveal>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground text-sm">Stay updated on appointments, tips and offers.</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-1" />Mark all read
          </Button>
        </div>
      </Reveal>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">You're all caught up</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => {
            const Icon = iconFor[n.kind];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border p-4 flex gap-4 ${!n.read ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.date).toLocaleString("en-IN")}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
