import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import {
  MapPin, Star, Building2, Phone, Clock, Stethoscope, User,
  Calendar, BadgeCheck, MessageCircle, Heart, Eye, Baby, Bone,
  Scissors, Brain, FlaskConical, Send, Loader2, Shield
} from "lucide-react";
import { useGetHospital, useListDoctors, getGetHospitalQueryKey } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BASE = import.meta.env.BASE_URL;

function CategoryIcon({ category }: { category: string }) {
  const c = (category || "").toLowerCase();
  const cls = "w-8 h-8";
  if (c.includes("cardio")) return <Heart className={`${cls} text-red-500`} />;
  if (c.includes("eye") || c.includes("netra")) return <Eye className={`${cls} text-blue-400`} />;
  if (c.includes("pediatric") || c.includes("child")) return <Baby className={`${cls} text-pink-500`} />;
  if (c.includes("ortho") || c.includes("bone")) return <Bone className={`${cls} text-amber-600`} />;
  if (c.includes("surgery")) return <Scissors className={`${cls} text-purple-500`} />;
  if (c.includes("neuro")) return <Brain className={`${cls} text-violet-500`} />;
  if (c.includes("urology")) return <FlaskConical className={`${cls} text-teal-500`} />;
  return <Building2 className={`${cls} text-slate-400`} />;
}

function StarRating({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`w-7 h-7 text-2xl transition-transform hover:scale-110 ${s <= rating ? "text-yellow-400" : "text-slate-300"}`}>
          ★
        </button>
      ))}
    </div>
  );
}

export default function HospitalDetail() {
  const { id } = useParams<{ id: string }>();
  const hospitalId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();

  const { data: hospital, isLoading: hospitalLoading } = useGetHospital(hospitalId, {
    query: { enabled: !!hospitalId, queryKey: getGetHospitalQueryKey(hospitalId) }
  });
  const { data: doctors, isLoading: doctorsLoading } = useListDoctors({ hospitalId });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", hospitalId],
    queryFn: async () => {
      const res = await fetch(`${BASE}api/hospitals/${hospitalId}/reviews`);
      return res.json();
    },
    enabled: !!hospitalId,
  });

  const [reviewForm, setReviewForm] = useState({ patientName: "", rating: 0, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const submitReview = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE}api/hospitals/${hospitalId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", hospitalId] });
      setReviewForm({ patientName: "", rating: 0, comment: "" });
      setReviewSubmitted(true);
    },
  });

  if (hospitalLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[240px] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!hospital) {
    return <div className="container mx-auto px-4 py-16 text-center text-slate-500">Hospital not found</div>;
  }

  const whatsappNumber = (hospital as any).whatsappNumber || hospital.phone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/91${whatsappNumber.replace(/\D/g, "").slice(-10)}?text=Hello%20${encodeURIComponent(hospital.name)}%2C%20I%20found%20you%20on%20DoctorKhoj%20and%20would%20like%20to%20book%20an%20appointment.`
    : null;

  const avgRating = reviews?.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : hospital.rating.toFixed(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 shrink-0">
              <div className="aspect-square max-w-[180px] md:max-w-full bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl overflow-hidden shadow-sm relative flex items-center justify-center">
                {hospital.imageUrl ? (
                  <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />
                ) : (
                  <CategoryIcon category={(hospital as any).category || hospital.type} />
                )}
                <Badge className={`absolute top-3 left-3 text-xs ${hospital.type === "government" ? "bg-green-500" : "bg-blue-500"}`}>
                  {hospital.type === "government" ? "Govt." : "Private"}
                </Badge>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{hospital.name}</h1>
                {(hospital as any).verified && (
                  <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold mt-1 shrink-0">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {avgRating} ({reviews?.length || 0} reviews)
                </div>
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-sm font-medium">
                  <Stethoscope className="w-4 h-4" /> {hospital.totalDoctors} Doctors
                </div>
                {(hospital as any).ayushmanAccepted && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-sm font-semibold">
                    <Shield className="w-4 h-4" /> Ayushman Card Accepted
                  </div>
                )}
                {(hospital as any).queueNumber > 0 && (
                  <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-sm font-semibold">
                    🔢 Live Queue: Token #{(hospital as any).queueNumber}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-slate-600 mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.address}</span>
                </div>
                {hospital.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.timings}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {hospital.specializations.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs bg-white">{spec}</Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button asChild className="rounded-xl">
                  <Link href="/doctors">Book Appointment</Link>
                </Button>
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp करें
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctors */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Doctors at {hospital.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctorsLoading ? (
                  [1, 2].map((i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
                ) : doctors?.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                    <Stethoscope className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">No doctors listed yet. Check back soon.</p>
                  </div>
                ) : (
                  doctors?.map((doctor) => (
                    <Card key={doctor.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all bg-white rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                            {doctor.imageUrl ? (
                              <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-blue-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h3 className="font-bold text-slate-900 text-sm truncate">{doctor.name}</h3>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                            </div>
                            <p className="text-primary font-semibold text-xs">{doctor.specialization}</p>
                            <p className="text-xs text-slate-400">{doctor.qualification}</p>
                          </div>
                          <div className="flex items-center gap-0.5 text-xs font-bold text-slate-700 shrink-0">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {doctor.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span><Clock className="w-3 h-3 inline mr-1" />{doctor.experience} yrs exp</span>
                          <span className="font-bold text-slate-800">₹{doctor.consultationFee}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {doctor.timings}
                        </div>
                        <Badge className="bg-blue-50 text-blue-700 border-none text-xs mb-3 w-full justify-center">
                          <BadgeCheck className="w-3 h-3 mr-1" /> Verified by DoctorKhoj
                        </Badge>
                        <Button size="sm" className="w-full text-xs h-8 rounded-lg" asChild>
                          <Link href={`/book/${doctor.id}`}>Book Appointment</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Patient Reviews / मरीज़ों की राय
              </h2>

              {reviewsLoading ? (
                <Skeleton className="h-24 w-full rounded-xl" />
              ) : reviews?.length === 0 ? (
                <p className="text-slate-400 text-sm italic mb-4">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {reviews?.map((r: any) => (
                    <Card key={r.id} className="shadow-sm border-slate-100">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {r.patientName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{r.patientName}</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className={`text-sm ${s <= r.rating ? "text-yellow-400" : "text-slate-200"}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Review form */}
              <Card className="shadow-sm border-blue-100 bg-blue-50/30">
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-800 mb-4">अपनी राय दें / Leave a Review</h3>
                  {reviewSubmitted ? (
                    <div className="text-center py-4 text-green-700 font-medium">
                      ✅ Thank you for your review!
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); submitReview.mutate(); }} className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1 block">Your Name *</Label>
                        <Input className="h-10 rounded-lg text-sm" placeholder="Rahul Kumar"
                          value={reviewForm.patientName}
                          onChange={(e) => setReviewForm((p) => ({ ...p, patientName: e.target.value }))} required />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1 block">Rating *</Label>
                        <StarRating rating={reviewForm.rating} onChange={(r) => setReviewForm((p) => ({ ...p, rating: r }))} />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600 mb-1 block">Comment (Optional)</Label>
                        <Textarea className="text-sm rounded-lg min-h-[70px] resize-none" placeholder="Share your experience..."
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} />
                      </div>
                      <Button type="submit" size="sm" className="rounded-lg" disabled={!reviewForm.patientName || !reviewForm.rating || submitReview.isPending}>
                        {submitReview.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-4 h-4 mr-1.5" />}
                        Submit Review
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-bold text-slate-900 mb-4">Contact / संपर्क</h3>
                <div className="space-y-3 text-sm">
                  {hospital.phone && (
                    <a href={`tel:${hospital.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors">
                      <Phone className="w-4 h-4 text-slate-400" /> {hospital.phone}
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" /> {hospital.timings}
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {hospital.address}
                  </div>
                </div>
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors w-full">
                    <MessageCircle className="w-4 h-4" /> WhatsApp पर Contact करें
                  </a>
                )}
              </CardContent>
            </Card>

            {(hospital as any).verified && (
              <Card className="shadow-sm bg-blue-50 border-blue-100">
                <CardContent className="p-4 text-center">
                  <BadgeCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-bold text-blue-800 text-sm">Verified by DoctorKhoj</p>
                  <p className="text-xs text-blue-600 mt-1">License & credentials verified by our team</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
