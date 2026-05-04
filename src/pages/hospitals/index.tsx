import { useState } from "react";
import { Link } from "wouter";
import {
  Search, MapPin, Star, Building2, ChevronRight, BadgeCheck,
  Heart, Eye, Baby, Bone, Scissors, Stethoscope, Brain,
  Shield, Zap, FlaskConical, Sparkles
} from "lucide-react";
import { useListHospitals } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BASE = import.meta.env.BASE_URL;

const CATEGORIES = [
  { label: "All / सभी", value: "" },
  { label: "Pediatric / बच्चे", value: "Pediatric", icon: Baby },
  { label: "Maternity / प्रसव", value: "Maternity", icon: Heart },
  { label: "Cardiology / हृदय", value: "Cardiology", icon: Heart },
  { label: "Eye Care / आँख", value: "Eye", icon: Eye },
  { label: "Orthopedic / हड्डी", value: "Orthopedic", icon: Bone },
  { label: "Surgery / सर्जरी", value: "Surgery", icon: Scissors },
  { label: "General / सामान्य", value: "General", icon: Stethoscope },
];

const LOCATIONS = ["All", "Jail Hata", "Belwatika", "Redma", "Chainpur Road", "Shahpur Road", "Bypass Road", "Police Line", "Nawatoli", "Hamidganj", "Daltonganj"];

function CategoryIcon({ category }: { category: string }) {
  const c = category.toLowerCase();
  const cls = "w-5 h-5";
  if (c.includes("cardio") || c.includes("heart")) return <Heart className={`${cls} text-red-500`} />;
  if (c.includes("eye") || c.includes("netra")) return <Eye className={`${cls} text-blue-400`} />;
  if (c.includes("pediatric") || c.includes("child") || c.includes("children")) return <Baby className={`${cls} text-pink-500`} />;
  if (c.includes("ortho") || c.includes("bone") || c.includes("trauma")) return <Bone className={`${cls} text-amber-600`} />;
  if (c.includes("surgery") || c.includes("surgical")) return <Scissors className={`${cls} text-purple-500`} />;
  if (c.includes("neuro") || c.includes("brain")) return <Brain className={`${cls} text-violet-500`} />;
  if (c.includes("urology") || c.includes("kidney")) return <FlaskConical className={`${cls} text-teal-500`} />;
  if (c.includes("maternity") || c.includes("gynec")) return <Heart className={`${cls} text-pink-400`} />;
  if (c.includes("emergency") || c.includes("trauma")) return <Zap className={`${cls} text-orange-500`} />;
  return <Stethoscope className={`${cls} text-primary`} />;
}

function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
      <BadgeCheck className="w-3 h-3" /> Verified
    </div>
  );
}

function AyushmanBadge() {
  return (
    <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
      🏥 Ayushman
    </div>
  );
}

function FeaturedBadge() {
  return (
    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
      <Sparkles className="w-3 h-3" /> Featured
    </div>
  );
}

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("All");
  const [ayushman, setAyushman] = useState(false);

  const { data: allHospitals, isLoading } = useListHospitals({
    search: debouncedSearch || undefined,
    type: type !== "all" ? type : undefined,
    specialization: category || undefined,
  });

  const filtered = allHospitals?.filter((h: any) => {
    if (ayushman && !h.ayushmanAccepted) return false;
    if (location !== "All" && h.location && !h.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  }) ?? [];

  const featured = filtered.filter((h: any) => h.featured);
  const regular = filtered.filter((h: any) => !h.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Palamu ke Hospitals <span className="text-slate-500 text-xl font-normal">/ पलामू के अस्पताल</span>
          </h1>
          <p className="text-slate-500 text-sm">सही अस्पताल खोजें और अपॉइंटमेंट बुक करें · Find & book at top healthcare facilities</p>
        </div>
        <Button variant="outline" asChild className="border-primary/40 text-primary hover:bg-primary/5">
          <Link href="/join">
            <Building2 className="w-4 h-4 mr-2" /> Join as Partner Hospital
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <Card className="mb-6 border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name, location, specialty..."
                className="pl-9 h-11 rounded-xl"
                value={search}
                onChange={(e) => { setSearch(e.target.value); if (!e.target.value) setDebouncedSearch(""); }}
              />
            </div>
            <Button type="submit" className="h-11 px-6 rounded-xl font-bold">Search / खोजें</Button>
          </form>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  category === value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs">All / सभी</TabsTrigger>
                <TabsTrigger value="government" className="text-xs">Govt. / सरकारी</TabsTrigger>
                <TabsTrigger value="private" className="text-xs">Private / निजी</TabsTrigger>
              </TabsList>
            </Tabs>

            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/30"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>

            <button
              onClick={() => setAyushman((v) => !v)}
              className={`flex items-center gap-2 h-9 px-3 text-xs font-semibold rounded-lg border transition-all ${
                ayushman
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Ayushman Card Accepted
            </button>

            <span className="text-xs text-slate-400 ml-auto">
              {isLoading ? "Loading..." : `${filtered.length} hospital${filtered.length !== 1 ? "s" : ""} found`}
            </span>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-sm">
              <Skeleton className="h-44 w-full rounded-none" />
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No hospitals found / कोई अस्पताल नहीं मिला</h3>
          <p className="text-slate-500 text-sm">Try changing filters or search terms</p>
        </div>
      ) : (
        <>
          {/* Featured section */}
          {featured.length > 0 && !debouncedSearch && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">Featured Hospitals / प्रमुख अस्पताल</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((hospital: any) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
              {regular.length > 0 && (
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-sm text-slate-400 font-medium">All Hospitals / सभी अस्पताल</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regular.map((hospital: any) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HospitalCard({ hospital }: { hospital: any }) {
  return (
    <Card className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl bg-white flex flex-col">
      <div className="h-36 bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden flex items-center justify-center">
        {hospital.imageUrl ? (
          <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon category={hospital.category || hospital.type} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge className={hospital.type === "government" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}>
            {hospital.type === "government" ? "Govt. / सरकारी" : "Private / निजी"}
          </Badge>
        </div>
        {hospital.featured && <FeaturedBadge />}
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1.5">
          <h3 className="font-bold text-base text-slate-900 leading-tight flex-1 line-clamp-2">{hospital.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {hospital.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {hospital.verified && <VerifiedBadge />}
          {hospital.ayushmanAccepted && <AyushmanBadge />}
        </div>

        {hospital.location && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{hospital.location}, Palamu</span>
          </div>
        )}

        {hospital.category && (
          <div className="flex items-center gap-1.5 mb-3">
            <CategoryIcon category={hospital.category} />
            <span className="text-xs font-medium text-slate-600">{hospital.category}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4 mt-auto">
          {hospital.specializations.slice(0, 2).map((spec: string) => (
            <Badge key={spec} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-xs font-normal">
              {spec}
            </Badge>
          ))}
          {hospital.specializations.length > 2 && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-xs">
              +{hospital.specializations.length - 2}
            </Badge>
          )}
        </div>

        {hospital.queueNumber > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
            <span className="text-xs text-primary font-semibold">🔢 Live Queue: Token #{hospital.queueNumber}</span>
          </div>
        )}

        <Button variant="outline" className="w-full rounded-lg group-hover:border-primary group-hover:text-primary transition-colors" asChild>
          <Link href={`/hospitals/${hospital.id}`}>
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
