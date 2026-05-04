import { Link } from "react-router-dom";
import { useFavorites } from "@/store/favorites";
import { MOCK_DOCTORS } from "@/lib/mock-data";
import { DoctorCard } from "@/components/doctor-card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations";

export default function Saved() {
  const fav = useFavorites();
  const saved = MOCK_DOCTORS.filter((d) => fav.has(d.id));

  return (
    <div className="container mx-auto py-8">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Saved Doctors</h1>
        <p className="text-muted-foreground text-sm mb-6">Your favorite practitioners, all in one place.</p>
      </Reveal>
      {saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Heart className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No saved doctors yet</p>
          <Button asChild className="mt-4 rounded-full bg-gradient-primary border-0"><Link to="/doctors">Find doctors</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)}
        </div>
      )}
    </div>
  );
}
