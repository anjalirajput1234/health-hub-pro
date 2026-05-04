import { Link } from "react-router-dom";
import { Star, MapPin, Briefcase, Heart, IndianRupee, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MockDoctor } from "@/lib/mock-data";
import { useFavorites } from "@/store/favorites";
import { motion } from "framer-motion";

export function DoctorCard({ doctor, index = 0 }: { doctor: MockDoctor; index?: number }) {
  const fav = useFavorites();
  const isFav = fav.has(doctor.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative rounded-2xl border border-border bg-card p-5 hover-lift overflow-hidden"
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex gap-4">
        <div className="relative shrink-0">
          <img
            src={doctor.photo}
            alt={doctor.name}
            loading="lazy"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-background shadow-card"
          />
          {doctor.availableToday && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-card" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-base truncate">{doctor.name}</h3>
              <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
              <p className="text-xs text-muted-foreground truncate">{doctor.qualifications}</p>
            </div>
            <button
              onClick={() => fav.toggle(doctor.id)}
              aria-label="Save"
              className="shrink-0 w-9 h-9 rounded-full grid place-items-center hover:bg-muted transition-colors"
            >
              <Heart className={`w-4 h-4 transition-all ${isFav ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"}`} />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" />{doctor.experienceYears} yrs</span>
            <span className="inline-flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-warning" />{doctor.rating} <span className="text-muted-foreground">({doctor.reviewsCount})</span></span>
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{doctor.city}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fees</p>
            <p className="font-display font-semibold flex items-center"><IndianRupee className="w-3.5 h-3.5" />{doctor.feeINR}</p>
          </div>
          {doctor.availableToday && (
            <Badge variant="secondary" className="bg-secondary/15 text-secondary border-secondary/20 gap-1">
              <Clock className="w-3 h-3" />{doctor.nextSlot}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="rounded-full">
            <Link to={`/doctors/${doctor.id}`}>View</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full bg-gradient-primary border-0">
            <Link to={`/book/${doctor.id}`}>Book</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-2xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded shimmer" />
          <div className="h-3 w-1/2 rounded shimmer" />
          <div className="h-3 w-2/3 rounded shimmer" />
        </div>
      </div>
      <div className="mt-4 h-10 rounded-xl shimmer" />
    </div>
  );
}
