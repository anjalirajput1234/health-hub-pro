import { Hospital, MapPin, Star } from "lucide-react";

const hospitals = [
  { name: "Sadar Hospital", city: "Daltonganj", rating: 4.6, beds: 250, img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80" },
  { name: "Apollo Clinic", city: "Ranchi", rating: 4.8, beds: 180, img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
  { name: "AIIMS Patna", city: "Patna", rating: 4.9, beds: 960, img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80" },
  { name: "Fortis Bengaluru", city: "Bengaluru", rating: 4.7, beds: 400, img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80" },
  { name: "Medanta", city: "New Delhi", rating: 4.8, beds: 1250, img: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80" },
  { name: "Lilavati Hospital", city: "Mumbai", rating: 4.7, beds: 332, img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80" },
];

export default function Hospitals() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-display font-bold">Top hospitals</h1>
      <p className="text-muted-foreground text-sm mb-6">Verified multi-specialty hospitals across India.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {hospitals.map((h) => (
          <article key={h.name} className="rounded-2xl border border-border bg-card overflow-hidden hover-lift">
            <img src={h.img} alt={h.name} className="w-full h-40 object-cover" loading="lazy" />
            <div className="p-5">
              <h3 className="font-display font-semibold">{h.name}</h3>
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{h.city}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-warning inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-warning" />{h.rating}</span>
                <span className="text-muted-foreground inline-flex items-center gap-1"><Hospital className="w-3.5 h-3.5" />{h.beds} beds</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
