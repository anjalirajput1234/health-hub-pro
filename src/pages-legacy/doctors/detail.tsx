import { useParams, Link } from "wouter";
import { Star, Building2, Clock, Calendar, GraduationCap, MapPin, Award, ShieldCheck } from "lucide-react";
import { useGetDoctor, getGetDoctorQueryKey } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const doctorId = parseInt(id || "0", 10);
  
  const { data: doctor, isLoading } = useGetDoctor(doctorId, {
    query: { enabled: !!doctorId, queryKey: getGetDoctorQueryKey(doctorId) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="container mx-auto px-4 py-16 text-center">Doctor not found</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg bg-slate-100 overflow-hidden shrink-0 mx-auto md:mx-0">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-blue-50">
                  <span className="text-6xl font-bold text-blue-200">{doctor.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{doctor.name}</h1>
                  <p className="text-xl text-primary font-medium mb-3">{doctor.specialization}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <GraduationCap className="w-3 h-3 mr-1" /> {doctor.qualification}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Medical Registration Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm min-w-24">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-2xl mb-1">
                    {doctor.rating.toFixed(1)} <Star className="w-5 h-5 fill-yellow-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> Practice Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Current Hospital/Clinic</p>
                    <p className="font-semibold text-slate-900 text-lg">
                      {doctor.hospitalName ? (
                        <Link href={`/hospitals/${doctor.hospitalId}`} className="hover:text-primary transition-colors">
                          {doctor.hospitalName}
                        </Link>
                      ) : (
                        "Independent Clinic"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Experience</p>
                    <p className="font-semibold text-slate-900 text-lg">{doctor.experience}+ Years</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500 mb-2">Availability</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availability.map(day => (
                        <Badge key={day} variant="outline" className="font-medium bg-slate-50">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500 mb-1">Timings</p>
                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {doctor.timings}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> About
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Dr. {doctor.name} is a highly respected {doctor.specialization.toLowerCase()} based in Palamu with over {doctor.experience} years of clinical experience. Known for a patient-centric approach and accurate diagnoses. Completed {doctor.qualification} and is dedicated to providing affordable and quality healthcare to the community.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Sidebar */}
          <div>
            <Card className="sticky top-24 shadow-md border-primary/20 bg-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 font-medium mb-1">Consultation Fee</p>
                  <p className="text-4xl font-bold text-slate-900 mb-2">₹{doctor.consultationFee}</p>
                  <p className="text-xs text-slate-400">Includes online parchi generation</p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3 text-sm text-slate-600">
                    <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Instant booking confirmation</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Secure online payments</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-600">
                    <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Digital OPD Parchi in 1 min</span>
                  </div>
                </div>
                
                <Button size="lg" className="w-full text-base font-bold h-14 rounded-xl" asChild>
                  <Link href={`/book/${doctor.id}`}>Book Appointment Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
