import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalIcon, Video, MapPin, X, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useAppointments, type Appointment } from "@/store/app";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Reveal } from "@/components/animations";

const statusVariant: Record<string, string> = {
  upcoming: "bg-secondary/15 text-secondary border-secondary/20",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive border-destructive/20",
};

function AppointmentCard({ a, onCancel }: { a: Appointment; onCancel: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card hover-lift"
    >
      <div className="flex items-start gap-4">
        <img src={a.doctorPhoto} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display font-semibold truncate">{a.doctorName}</p>
              <p className="text-sm text-primary">{a.specialization}</p>
            </div>
            <Badge className={statusVariant[a.status] + " border capitalize"}>{a.status}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CalIcon className="w-3 h-3" />{new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} • {a.time}</span>
            <span className="inline-flex items-center gap-1">{a.mode === "video" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}{a.mode === "video" ? "Video" : a.hospital}</span>
          </div>
        </div>
      </div>
      {a.status === "upcoming" && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("Added to Google Calendar")}>
            <ExternalLink className="w-3 h-3 mr-1" />Add to Calendar
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.info("Reschedule flow coming soon")}>Reschedule</Button>
          <Button size="sm" variant="outline" className="rounded-full text-destructive border-destructive/40 hover:bg-destructive/10" onClick={onCancel}>
            <X className="w-3 h-3 mr-1" />Cancel
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default function AppointmentsPage() {
  const { items, cancel } = useAppointments();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcoming = items.filter((i) => i.status === "upcoming");
  const past = items.filter((i) => i.status === "completed");
  const cancelled = items.filter((i) => i.status === "cancelled");

  const lists: Record<string, Appointment[]> = { upcoming, past, cancelled };

  return (
    <div className="container mx-auto py-8">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">My Appointments</h1>
        <p className="text-muted-foreground text-sm mb-6">Track upcoming visits, view history, and manage bookings.</p>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <Tabs defaultValue="upcoming">
            <TabsList className="rounded-full bg-muted p-1">
              <TabsTrigger value="upcoming" className="rounded-full">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past" className="rounded-full">Past ({past.length})</TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-full">Cancelled ({cancelled.length})</TabsTrigger>
            </TabsList>

            {(["upcoming", "past", "cancelled"] as const).map((k) => (
              <TabsContent key={k} value={k} className="mt-5 space-y-3">
                <AnimatePresence>
                  {lists[k].length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                      <CalIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium">No {k} appointments</p>
                      <Button asChild className="mt-4 rounded-full bg-gradient-primary border-0"><Link to="/doctors">Book a doctor</Link></Button>
                    </div>
                  ) : (
                    lists[k].map((a) => (
                      <AppointmentCard key={a.id} a={a} onCancel={() => { cancel(a.id); toast.success("Appointment cancelled"); }} />
                    ))
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-4 shadow-card h-fit">
          <h3 className="font-display font-semibold mb-3 px-2">Calendar</h3>
          <Calendar mode="single" selected={date} onSelect={setDate} className="p-0 pointer-events-auto" />
        </aside>
      </div>
    </div>
  );
}
