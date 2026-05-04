import { useState } from "react";
import {
  Shield, CheckCircle2, XCircle, Clock, Building2, Phone,
  FileText, Eye, RefreshCw, Star, BadgeCheck, Loader2, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BASE = import.meta.env.BASE_URL;

type Registration = {
  id: number;
  clinicName: string;
  specialization: string;
  registrationNumber: string;
  doctorName: string | null;
  location: string;
  whatsappNumber: string;
  status: string;
  submittedAt: string;
  rejectionReason: string | null;
};

type Hospital = {
  id: number;
  name: string;
  category: string;
  location: string;
  verified: boolean;
  featured: boolean;
  ayushmanAccepted: boolean;
  status: string;
  rating: number;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Pending</Badge>;
  if (status === "approved") return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Approved</Badge>;
  return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Rejected</Badge>;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<{ id: number; reason: string } | null>(null);

  const headers = { "Content-Type": "application/json", "x-admin-password": password };

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}api/admin/registrations`, { headers });
      if (!res.ok) { setAuthError("Invalid password. Try again."); setLoading(false); return; }
      const regs = await res.json();
      setRegistrations(regs);
      const hRes = await fetch(`${BASE}api/admin/hospitals`, { headers });
      setHospitals(await hRes.json());
      setAuthed(true);
      setAuthError("");
    } catch {
      setAuthError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    const [r1, r2] = await Promise.all([
      fetch(`${BASE}api/admin/registrations`, { headers }),
      fetch(`${BASE}api/admin/hospitals`, { headers }),
    ]);
    setRegistrations(await r1.json());
    setHospitals(await r2.json());
    setLoading(false);
  };

  const approve = async (id: number) => {
    setActionLoading(id);
    await fetch(`${BASE}api/admin/registrations/${id}/approve`, { method: "POST", headers });
    await refresh();
    setActionLoading(null);
  };

  const reject = async () => {
    if (!rejectReason) return;
    setActionLoading(rejectReason.id);
    await fetch(`${BASE}api/admin/registrations/${rejectReason.id}/reject`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: rejectReason.reason }),
    });
    setRejectReason(null);
    await refresh();
    setActionLoading(null);
  };

  const toggleHospital = async (id: number, field: string, value: boolean) => {
    await fetch(`${BASE}api/admin/hospitals/${id}`, {
      method: "PATCH", headers,
      body: JSON.stringify({ [field]: value }),
    });
    setHospitals((prev) => prev.map((h) => h.id === id ? { ...h, [field]: value } : h));
  };

  if (!authed) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">DoctorKhoj Super Admin Access</p>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  className="h-11 rounded-xl"
                />
              </div>
              {authError && <p className="text-red-600 text-sm">{authError}</p>}
              <Button className="w-full h-11 rounded-xl" onClick={login} disabled={loading || !password}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" />Login</>}
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-4">Restricted access — authorised personnel only</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pending = registrations.filter((r) => r.status === "pending");
  const processed = registrations.filter((r) => r.status !== "pending");

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">DoctorKhoj — Super Admin Control Panel</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Review", value: pending.length, color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
            { label: "Total Registrations", value: registrations.length, color: "text-blue-500", bg: "bg-blue-50", icon: FileText },
            { label: "Live Hospitals", value: hospitals.filter((h) => h.verified).length, color: "text-green-500", bg: "bg-green-50", icon: CheckCircle2 },
            { label: "Featured", value: hospitals.filter((h) => h.featured).length, color: "text-primary", bg: "bg-primary/5", icon: Star },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <Card key={label} className="shadow-sm border-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="registrations">
          <TabsList className="mb-6">
            <TabsTrigger value="registrations">
              New Registrations {pending.length > 0 && <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{pending.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="hospitals">All Hospitals</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            {rejectReason && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-3">Reason for Rejection</h3>
                    <Input placeholder="e.g. Invalid registration number" className="mb-4"
                      value={rejectReason.reason}
                      onChange={(e) => setRejectReason({ ...rejectReason, reason: e.target.value })} />
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setRejectReason(null)}>Cancel</Button>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={reject}
                        disabled={!rejectReason.reason || actionLoading === rejectReason.id}>
                        {actionLoading === rejectReason.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reject"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="space-y-4">
              {pending.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No pending registrations</p>
                  <p className="text-sm text-slate-400">All caught up!</p>
                </div>
              )}
              {pending.map((reg) => (
                <Card key={reg.id} className="shadow-sm border-amber-100 bg-amber-50/50">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{reg.clinicName}</h3>
                          <StatusBadge status={reg.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-slate-600">
                          <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" />{reg.specialization}</div>
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{reg.location}</div>
                          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{reg.whatsappNumber}</div>
                          <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" />{reg.registrationNumber}</div>
                        </div>
                        {reg.doctorName && <p className="text-sm text-slate-500">Doctor: <span className="font-medium">{reg.doctorName}</span></p>}
                        <p className="text-xs text-slate-400">Submitted: {new Date(reg.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                          onClick={() => approve(reg.id)} disabled={actionLoading === reg.id}>
                          {actionLoading === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</>}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                          onClick={() => setRejectReason({ id: reg.id, reason: "" })}>
                          <XCircle className="w-3.5 h-3.5 mr-1" />Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {processed.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Processed</h3>
                  <div className="space-y-3">
                    {processed.map((reg) => (
                      <Card key={reg.id} className="shadow-sm opacity-70">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">{reg.clinicName}</p>
                            <p className="text-xs text-slate-400">{reg.location} · {reg.specialization}</p>
                          </div>
                          <StatusBadge status={reg.status} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="hospitals">
            <div className="space-y-3">
              {hospitals.map((h) => (
                <Card key={h.id} className="shadow-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{h.name}</h3>
                        {h.verified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500">{h.category} · {h.location} · ⭐ {h.rating}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button onClick={() => toggleHospital(h.id, "verified", !h.verified)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${h.verified ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>
                        <BadgeCheck className="w-3.5 h-3.5" /> {h.verified ? "Verified ✓" : "Verify"}
                      </button>
                      <button onClick={() => toggleHospital(h.id, "featured", !h.featured)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${h.featured ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>
                        <Star className="w-3.5 h-3.5" /> {h.featured ? "Featured ✓" : "Feature"}
                      </button>
                      <button onClick={() => toggleHospital(h.id, "ayushmanAccepted", !h.ayushmanAccepted)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${h.ayushmanAccepted ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>
                        🏥 {h.ayushmanAccepted ? "Ayushman ✓" : "Ayushman"}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MapPin(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
