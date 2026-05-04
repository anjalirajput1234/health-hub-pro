import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, Star, Building2, User, Clock, Calendar } from "lucide-react";
import { useListDoctors } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Doctors() {
  const [location] = useLocation();
  
  // Extract search from query string if present
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const initialSearch = searchParams.get("search") || "";
  const initialSpec = searchParams.get("specialization") || "all";
  
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [specialization, setSpecialization] = useState<string>(initialSpec);

  const { data: doctors, isLoading } = useListDoctors({
    search: debouncedSearch || undefined,
    specialization: specialization !== "all" ? specialization : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
    "Gynecology", "Oncology", "Dermatology", "General Medicine",
    "ENT", "Ophthalmology", "Psychiatry", "Dentist", "Physician"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Doctor</h1>
          <p className="text-slate-600">Book appointments with top specialists in Palamu</p>
        </div>
      </div>

      <Card className="mb-8 border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search doctors by name..." 
                className="pl-10 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="w-full md:w-[220px] h-12">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" className="h-12 px-8">Search</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-sm">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="p-5 flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-none" />
                <div className="p-4 mt-auto">
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : doctors?.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
            <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No doctors found</h3>
            <p>We couldn't find any doctors matching your search criteria.</p>
            <Button variant="outline" className="mt-6" onClick={() => {
              setSearch("");
              setDebouncedSearch("");
              setSpecialization("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          doctors?.map((doctor) => (
            <Card key={doctor.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all bg-white flex flex-col rounded-xl">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                    {doctor.imageUrl ? (
                      <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 truncate" title={doctor.name}>{doctor.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-yellow-50 border border-yellow-100 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {doctor.rating.toFixed(1)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-medium mb-1">
                      {doctor.specialization}
                    </Badge>
                    <p className="text-xs text-slate-500 truncate">{doctor.qualification}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{doctor.hospitalName || "Independent Clinic"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doctor.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.availability.join(", ")}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Consultation Fee</p>
                    <p className="font-bold text-slate-900 text-xl">₹{doctor.consultationFee}</p>
                  </div>
                  <Button className="rounded-lg shadow-sm" asChild>
                    <Link href={`/book/${doctor.id}`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
