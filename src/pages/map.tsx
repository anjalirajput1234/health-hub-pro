import { MapPin, Phone, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations";

const pins = [
  { name: "Sadar Hospital", dist: "0.8 km", rating: 4.6, x: 32, y: 48 },
  { name: "Apollo Clinic", dist: "1.5 km", rating: 4.8, x: 58, y: 32 },
  { name: "Medanta Multi-specialty", dist: "2.1 km", rating: 4.9, x: 70, y: 60 },
  { name: "City Care Hospital", dist: "3.0 km", rating: 4.5, x: 22, y: 70 },
];

export default function NearbyMap() {
  return (
    <div className="container mx-auto py-8">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Nearby Hospitals</h1>
        <p className="text-muted-foreground text-sm mb-6">Find emergency care closest to you.</p>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Map (decorative) */}
        <div className="relative rounded-3xl overflow-hidden border border-border bg-card h-[500px] shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_60%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,50 Q30,40 60,55 T100,50" stroke="hsl(var(--primary)/0.3)" strokeWidth="0.6" fill="none" />
            <path d="M50,0 Q55,40 45,70 T50,100" stroke="hsl(var(--secondary)/0.3)" strokeWidth="0.6" fill="none" />
          </svg>
          {/* User pin */}
          <div className="absolute" style={{ left: "48%", top: "50%" }}>
            <span className="absolute -inset-3 rounded-full bg-primary/30 animate-ping" />
            <span className="relative block w-4 h-4 rounded-full bg-primary border-2 border-background" />
          </div>
          {pins.map((p, i) => (
            <div key={p.name} className="absolute group" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <div className="w-9 h-9 -translate-x-1/2 -translate-y-full rounded-full bg-destructive text-destructive-foreground grid place-items-center shadow-elevated cursor-pointer hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded-md bg-card border border-border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{p.name}</div>
            </div>
          ))}
        </div>

        <aside className="space-y-3">
          {pins.map((p) => (
            <div key={p.name} className="rounded-2xl border border-border bg-card p-4 hover-lift">
              <p className="font-display font-semibold">{p.name}</p>
              <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                <span className="inline-flex items-center gap-1"><Navigation className="w-3 h-3" />{p.dist}</span>
                <span className="inline-flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-warning" />{p.rating}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" className="rounded-full bg-gradient-primary border-0 flex-1">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer">
                    <Navigation className="w-3 h-3 mr-1" />Directions
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <a href="tel:108"><Phone className="w-3 h-3" /></a>
                </Button>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
