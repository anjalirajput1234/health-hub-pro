import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Calendar, Clock, MapPin, Stethoscope, ChevronRight,
  Search, User, HeartPulse, Activity, Plus, FileText,
  CheckCircle2, AlertCircle, TrendingUp, Droplets
} from "lucide-react";
import { useListAppointments } from "@/lib/api-client";
import { useAuth, getInitials } from "@/context/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const [guestEmail, setGuestEmail] = useState("");
  const [activeEmail, setActiveEmail] = useState(user?.email ?? "");

  const { data: appointments, isLoading } = useListAppointments(
    { patientEmail: activeEmail },
    { query: { queryKey: ["appointments", activeEmail], enabled: !!activeEmail } }
  );

  const paid = appointments?.filter((a) => a.paymentStatus === "paid") ?? [];
  const pending = appointments?.filter((a) => a.paymentStatus !== "paid") ?? [];
  const upcoming = appointments?.filter((a) => new Date(a.appointmentDate) >= new Date()) ?? [];
  const past = appointments?.filter((a) => new Date(a.appointmentDate) < new Date()) ?? [];

  const handleGuestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestEmail.includes("@")) setActiveEmail(guestEmail);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Logged-in header ── */}
        {user ? (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow"
                  style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
                >
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Welcome back</p>
                  <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <HeartPulse className="w-3.5 h-3.5 text-primary" />
                    {user.email}
                    {user.bloodGroup && (
                      <><span className="mx-1 text-slate-300">·</span>
                        <Droplets className="w-3.5 h-3.5 text-red-400" />
                        {user.bloodGroup}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile"><User className="w-4 h-4 mr-1.5" />My Profile</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/doctors"><Plus className="w-4 h-4 mr-1.5" />Book Appointment</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Visits", value: appointments?.length ?? "–", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-green-500", bg: "bg-green-50" },
                { label: "Pending Payment", value: pending.length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
                { label: "Completed", value: past.filter((a) => a.paymentStatus === "paid").length, icon: CheckCircle2, color: "text-primary", bg: "bg-primary/5" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className="shadow-sm border-none">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{isLoading ? "…" : value}</p>
                      <p className="text-xs text-slate-500 font-medium">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* ── Guest search ── */
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">My Appointments</h1>
            <p className="text-slate-500 mb-6">
              <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link> for your personal dashboard, or enter your email below to look up records.
            </p>
            <Card className="border-primary/20 shadow-md">
              <CardContent className="p-5">
                <form onSubmit={handleGuestSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email" placeholder="Enter your email address..."
                      className="pl-9 h-11 rounded-xl"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="h-11 px-6 rounded-xl font-bold">Search</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Appointments list ── */}
        {activeEmail && (
          <div>
            {user ? (
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Appointment History
                </h2>
                <Badge variant="outline" className="bg-white font-semibold">
                  {appointments?.length ?? 0} total
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Records for <span className="text-primary">{activeEmail}</span></h2>
                <Badge variant="outline" className="bg-white">{appointments?.length ?? 0} appointments</Badge>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardContent className="p-6 flex gap-6">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !appointments?.length ? (
              <Card className="border-dashed border-2 border-slate-200 bg-white">
                <CardContent className="py-14 text-center">
                  <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Appointments Found</h3>
                  <p className="text-slate-500 mb-6">
                    {user ? "You haven't booked any appointments yet." : "No records found for this email."}
                  </p>
                  <Button asChild>
                    <Link href="/doctors">Book Your First Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => {
                  const isPaid = apt.paymentStatus === "paid";
                  const isPast = new Date(apt.appointmentDate) < new Date(new Date().setHours(0, 0, 0, 0));
                  return (
                    <Card key={apt.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all bg-white group">
                      <div className={`h-1 w-full ${isPaid ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-amber-400 to-orange-400"}`} />
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                          <div className="flex-1 space-y-2.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono text-xs bg-slate-50 border-slate-200">
                                {apt.slipNumber}
                              </Badge>
                              <Badge
                                className={isPaid
                                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                  : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"}
                                variant="outline"
                              >
                                {isPaid ? <><CheckCircle2 className="w-3 h-3 mr-1" />Paid</> : <><AlertCircle className="w-3 h-3 mr-1" />Payment Pending</>}
                              </Badge>
                              {isPast && <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100 text-xs" variant="outline">Past</Badge>}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Dr. {apt.doctorName}</h3>

                            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{apt.specialization}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{apt.hospitalName || "Independent Clinic"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800">{apt.appointmentDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800">{apt.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0">
                            {isPaid ? (
                              <Button asChild variant="outline" className="flex-1 md:w-36">
                                <Link href={`/appointments/${apt.id}`}>
                                  View Parchi <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            ) : (
                              <>
                                <Button asChild className="flex-1 md:w-36 bg-green-600 hover:bg-green-700 font-bold shadow-sm">
                                  <Link href={`/appointments/${apt.id}/pay`}>Pay ₹{apt.consultationFee}</Link>
                                </Button>
                                <Button asChild variant="outline" className="flex-1 md:w-36">
                                  <Link href={`/appointments/${apt.id}`}>Details</Link>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Empty state for logged-in with no email yet active ── */}
        {user && !activeEmail && !isLoading && (
          <div className="text-center py-10">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading your appointment history...</p>
          </div>
        )}
      </div>
    </div>
  );
}
