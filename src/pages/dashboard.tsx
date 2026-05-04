import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_DOCTORS } from "@/lib/mock-data";
import { useFavorites } from "@/store/favorites";
import { DoctorCard } from "@/components/doctor-card";

const upcoming = [
  { id: "a1", doctor: MOCK_DOCTORS[1], date: "Tomorrow, 4:30 PM", mode: "In-clinic" },
  { id: "a2", doctor: MOCK_DOCTORS[3], date: "Fri, 10:00 AM", mode: "Video" },
];

export default function Dashboard() {
  const fav = useFavorites();
  const saved = MOCK_DOCTORS.filter((d) => fav.has(d.id));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-display font-bold">My Bookings</h1>
      <p className="text-muted-foreground text-sm mb-6">Track upcoming appointments and saved doctors.</p>

      <section className="mb-10">
        <h2 className="font-display font-semibold mb-3">Upcoming</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-card">
              <img src={a.doctor.photo} className="w-16 h-16 rounded-2xl object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold truncate">{a.doctor.name}</p>
                <p className="text-sm text-primary">{a.doctor.specialization}</p>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{a.date} • {a.mode}</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full">Details</Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold mb-3">Saved doctors</h2>
        {saved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No saved doctors yet</p>
            <Button asChild className="mt-4 rounded-full bg-gradient-primary border-0"><Link to="/doctors">Find doctors</Link></Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
