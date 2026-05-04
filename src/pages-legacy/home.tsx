import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, Star, Building2, User, ChevronRight, Activity, Clock } from "lucide-react";
import { 
  useGetPlatformStats, 
  useGetFeaturedDoctors, 
  useGetFeaturedHospitals 
} from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: featuredDoctors, isLoading: doctorsLoading } = useGetFeaturedDoctors();
  const { data: featuredHospitals, isLoading: hospitalsLoading } = useGetFeaturedHospitals();

  const safeDoctors = Array.isArray(featuredDoctors) ? featuredDoctors : [];
  const safeHospitals = Array.isArray(featuredHospitals) ? featuredHospitals : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-white -z-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-primary bg-primary/10 hover:bg-primary/20 font-medium border-none rounded-full">
              Palamu's #1 Healthcare Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Find the right doctor <br className="hidden md:block" />
              <span className="text-primary">right now.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Book appointments, get digital OPD parchi, and find top-rated hospitals in Daltonganj and across Palamu district.
            </p>
            
            <Card className="p-2 md:p-3 shadow-lg border-primary/20 max-w-2xl mx-auto lg:mx-0 rounded-2xl bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Search doctors, hospitals, or symptoms..." 
                    className="pl-10 h-12 md:h-14 text-base bg-white border-slate-200 focus-visible:ring-primary/20 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 md:h-14 px-8 rounded-xl text-base font-semibold shadow-sm">
                  Search
                </Button>
              </form>
            </Card>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Popular:</span>
              {["Physician", "Cardiologist", "Dentist", "Pediatrician"].map(spec => (
                <Link key={spec} href={`/doctors?specialization=${spec}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 transition-colors py-1 px-3 rounded-full text-slate-600 font-normal">
                    {spec}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-square lg:aspect-[4/3] border-4 border-white">
              <img 
                src="/hero-doctor.jpg" 
                alt="Smiling professional doctor" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <p className="font-semibold text-lg drop-shadow-sm">Trusted Care</p>
                  <p className="text-sm text-white/80">Available 24/7</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                      {i === 4 ? "+5k" : <User className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 md:-right-8 lg:-right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-700 delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">AI Symptom Check</p>
                  <p className="text-xs text-slate-500">Free consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-10" />
                  <Skeleton className="w-24 h-4" />
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stats?.totalHospitals || "50"}+
                  </div>
                  <div className="text-sm md:text-base text-slate-600 font-medium">Hospitals</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stats?.totalDoctors || "150"}+
                  </div>
                  <div className="text-sm md:text-base text-slate-600 font-medium">Specialist Doctors</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stats?.totalAppointments || "10,000"}+
                  </div>
                  <div className="text-sm md:text-base text-slate-600 font-medium">Appointments Booked</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stats?.totalSpecializations || "20"}+
                  </div>
                  <div className="text-sm md:text-base text-slate-600 font-medium">Specialties</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Top Doctors in Palamu</h2>
              <p className="text-slate-600">Book appointments with our most highly rated specialists</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:bg-slate-200" asChild>
              <Link href="/doctors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            {doctorsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-sm">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : safeDoctors.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No featured doctors available yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/doctors">Browse All Doctors</Link>
                </Button>
              </div>
            ) : (
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {safeDoctors.map((doctor) => (
                    <CarouselItem key={doctor.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card className="group overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all bg-white flex flex-col h-full rounded-xl">
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                          {doctor.imageUrl ? (
                            <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                              <User className="w-16 h-16" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            {doctor.rating.toFixed(1)}
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{doctor.name}</h3>
                          <p className="text-primary font-medium text-sm mb-3">{doctor.specialization}</p>
                          <div className="space-y-2 mb-6 mt-auto">
                            <div className="flex items-center text-sm text-slate-600 gap-2">
                              <Building2 className="w-4 h-4 shrink-0" />
                              <span className="line-clamp-1">{doctor.hospitalName || "Independent Clinic"}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 gap-2">
                              <Clock className="w-4 h-4 shrink-0" />
                              <span>{doctor.experience} Years Exp.</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <span className="font-bold text-slate-900">₹{doctor.consultationFee}</span>
                            <Button size="sm" className="rounded-lg" asChild>
                              <Link href={`/book/${doctor.id}`}>Book Now</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-4 bg-white shadow-md hover:bg-slate-50 border-slate-200" />
                  <CarouselNext className="-right-4 bg-white shadow-md hover:bg-slate-50 border-slate-200" />
                </div>
              </Carousel>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link href="/doctors">View all doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Hospitals Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Featured Hospitals</h2>
              <p className="text-slate-600">The most trusted healthcare facilities in the region</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:bg-slate-100" asChild>
              <Link href="/hospitals">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hospitalsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-sm">
                  <Skeleton className="h-56 w-full rounded-none" />
                  <CardContent className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-5" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : safeHospitals.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-slate-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No featured hospitals available yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/hospitals">Browse All Hospitals</Link>
                </Button>
              </div>
            ) : (
              safeHospitals.slice(0, 3).map((hospital) => (
                <Card key={hospital.id} className="group overflow-hidden border-slate-100 shadow-sm hover:shadow-lg transition-all rounded-2xl bg-white flex flex-col">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {hospital.imageUrl ? (
                      <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                        <Building2 className="w-16 h-16" />
                      </div>
                    )}
                    <Badge className={`absolute top-4 left-4 ${hospital.type === 'government' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                      {hospital.type === 'government' ? 'Govt.' : 'Private'}
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-bold text-xl text-slate-900 leading-tight">{hospital.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-sm font-semibold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        {hospital.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                      <p className="line-clamp-2 leading-relaxed">{hospital.address}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {hospital.specializations.slice(0, 3).map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-normal">
                          {spec}
                        </Badge>
                      ))}
                      {hospital.specializations.length > 3 && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-normal">
                          +{hospital.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" className="w-full rounded-xl mt-auto" asChild>
                      <Link href={`/hospitals/${hospital.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link href="/hospitals">View all hospitals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Not sure which doctor to see?
          </h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            Use our AI Symptom Checker. Just tell us how you're feeling, and we'll guide you to the right specialist in Palamu.
          </p>
          <Button size="lg" className="h-14 px-8 text-base rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl" asChild>
            <Link href="/chatbot">
              Try AI Symptom Checker <Activity className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}