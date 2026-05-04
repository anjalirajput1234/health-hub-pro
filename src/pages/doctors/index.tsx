import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MOCK_DOCTORS, SPECIALIZATIONS, STATES } from "@/lib/mock-data";
import { DoctorCard, DoctorCardSkeleton } from "@/components/doctor-card";

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}

export default function DoctorsList() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const dq = useDebounced(q, 250);
  const [spec, setSpec] = useState(params.get("spec") || "all");
  const [state, setState] = useState("all");
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [availOnly, setAvailOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (dq) p.set("q", dq);
    if (spec !== "all") p.set("spec", spec);
    setParams(p, { replace: true });
  }, [dq, spec, setParams]);

  const filtered = useMemo(() => {
    let arr = MOCK_DOCTORS.filter((d) => {
      if (dq && !`${d.name} ${d.specialization} ${d.hospital}`.toLowerCase().includes(dq.toLowerCase())) return false;
      if (spec !== "all" && !d.specialization.toLowerCase().includes(spec.toLowerCase())) return false;
      if (state !== "all" && d.state !== state) return false;
      if (d.feeINR > maxFee) return false;
      if (d.rating < minRating) return false;
      if (availOnly && !d.availableToday) return false;
      return true;
    });
    if (sort === "rating") arr = arr.sort((a, b) => b.rating - a.rating);
    if (sort === "exp") arr = arr.sort((a, b) => b.experienceYears - a.experienceYears);
    if (sort === "fee") arr = arr.sort((a, b) => a.feeINR - b.feeINR);
    return arr;
  }, [dq, spec, state, maxFee, minRating, availOnly, sort]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Specialization</Label>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="mt-2 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialties</SelectItem>
            {SPECIALIZATIONS.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">State</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="mt-2 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Max fees</span><span>₹{maxFee}</span>
        </div>
        <Slider value={[maxFee]} onValueChange={(v) => setMaxFee(v[0])} min={200} max={2000} step={50} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Min rating</span><span>{minRating.toFixed(1)} ★</span>
        </div>
        <Slider value={[minRating]} onValueChange={(v) => setMinRating(v[0])} min={0} max={5} step={0.5} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={availOnly} onCheckedChange={(v) => setAvailOnly(!!v)} /> <span className="text-sm">Available today</span>
      </label>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold">Find your doctor</h1>
        <p className="text-muted-foreground text-sm mt-1 inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> Showing results across India
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display font-semibold mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h2>
            {Filters}
          </div>
        </aside>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, specialty, hospital…" className="pl-10 h-11 rounded-xl" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden rounded-xl h-11"><SlidersHorizontal className="w-4 h-4" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]"><div className="mt-8">{Filters}</div></SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="exp">Experience</SelectItem>
                <SelectItem value="fee">Lowest fees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{loading ? "Loading…" : `${filtered.length} doctors found`}</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-display font-semibold">No doctors match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">Try widening your search criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
