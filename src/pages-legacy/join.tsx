import { useState } from "react";
import { Building2, Stethoscope, Phone, MapPin, FileText, Upload, CheckCircle2, ChevronRight, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BASE = import.meta.env.BASE_URL;

const SPECIALIZATIONS = [
  "General Medicine", "Pediatric", "Maternity/Gynecology", "Cardiology", "Orthopedic",
  "Eye Care", "ENT", "Neurology", "Dermatology", "Urology", "Oncology",
  "Psychiatry", "Dentistry", "Physiotherapy", "Trauma/Emergency", "Surgery", "Other"
];

const LOCATIONS = [
  "Jail Hata", "Belwatika", "Belwatika Chowk", "Redma", "Chainpur Road",
  "Shahpur Road", "Bypass Road", "Panki Road", "Police Line", "Nawatoli",
  "Nauranga", "Hamidganj", "Abadganj", "Sudna", "Medininagar", "Daltonganj",
];

const BENEFITS = [
  { icon: Users, title: "1000+ Patients Monthly", desc: "Get discovered by patients searching for your specialty" },
  { icon: Shield, title: "Verified Badge", desc: "Blue-tick verification builds trust with patients" },
  { icon: Clock, title: "Manage Queue Live", desc: "Update live token status from your dashboard" },
  { icon: CheckCircle2, title: "Ayushman Integration", desc: "Flag your hospital for Ayushman card patients" },
];

export default function JoinAsPartner() {
  const [form, setForm] = useState({
    clinicName: "", specialization: "", registrationNumber: "",
    doctorName: "", location: "", whatsappNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.clinicName || !form.specialization || !form.registrationNumber || !form.location || !form.whatsappNumber) {
      setError("Please fill all required fields.");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.whatsappNumber)) {
      setError("WhatsApp number must be a 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}api/hospitals/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted({ id: data.id });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Registration Submitted!</h1>
          <p className="text-slate-600 mb-4">
            Your application has been submitted successfully. Our team will review your details and contact you within <strong>2–3 business days</strong>.
          </p>
          <div className="bg-slate-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-slate-500 font-medium mb-1">Your Application ID</p>
            <p className="text-lg font-bold text-primary">#{submitted.id}</p>
            <p className="text-xs text-slate-400 mt-1">Save this ID to track your application status</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left text-sm text-blue-700">
            <p className="font-semibold mb-1">What happens next?</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>Our team verifies your registration number</li>
              <li>You receive a WhatsApp confirmation message</li>
              <li>Your hospital gets the Blue Verified tick</li>
              <li>You get access to the Hospital Dashboard</li>
            </ol>
          </div>
          <Button className="mt-6 w-full" onClick={() => { setSubmitted(null); setForm({ clinicName:"", specialization:"", registrationNumber:"", doctorName:"", location:"", whatsappNumber:"" }); }}>
            Submit Another Hospital
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-blue-700 text-white py-14 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1.5">
            🏥 DoctorKhoj Partner Program
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            अपने Hospital को DoctorKhoj पर List करें
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Join as a Partner Hospital and get discovered by thousands of patients across Palamu, Jharkhand.
            Free listing · Verified badge · No commission.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="shadow-sm text-center border-none">
              <CardContent className="p-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <Card className="lg:col-span-3 shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hospital Registration Form</h2>
                  <p className="text-sm text-slate-500">All starred fields are required</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Hospital / Clinic Name *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input className="pl-9 h-11 rounded-xl" placeholder="e.g. Vinayak Children Hospital"
                      value={form.clinicName} onChange={(e) => setForm((p) => ({ ...p, clinicName: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Specialization *</Label>
                    <select className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={form.specialization} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}>
                      <option value="">Select Specialty</option>
                      {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Area / Location *</Label>
                    <select className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}>
                      <option value="">Select Area</option>
                      {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                      Doctor / Owner Name
                    </Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input className="pl-9 h-11 rounded-xl" placeholder="Dr. Rajesh Kumar"
                        value={form.doctorName} onChange={(e) => setForm((p) => ({ ...p, doctorName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                      WhatsApp Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input className="pl-9 h-11 rounded-xl" type="tel" placeholder="10-digit number"
                        value={form.whatsappNumber} onChange={(e) => setForm((p) => ({ ...p, whatsappNumber: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Medical License / Registration Number *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input className="pl-9 h-11 rounded-xl" placeholder="e.g. JH-MCI-2024-XXXXX"
                      value={form.registrationNumber} onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))} />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center text-slate-400 bg-slate-50">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Document Upload</p>
                  <p className="text-xs mt-1">License / ID Proof upload coming soon</p>
                  <p className="text-xs text-slate-400 mt-1">For now, submit registration number above</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
                )}

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
                  {loading ? "Submitting..." : (<>Submit for Verification <ChevronRight className="w-4 h-4 ml-1" /></>)}
                </Button>

                <p className="text-center text-xs text-slate-400">
                  By submitting, you agree to DoctorKhoj's Partner Terms. Verification typically takes 2–3 business days.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Info panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardContent className="p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Verification Process
                </h3>
                <ol className="space-y-3">
                  {[
                    "Submit your hospital details",
                    "Admin reviews your Medical License",
                    "Background verification (1–2 days)",
                    "Approval & Blue Verified Tick awarded",
                    "Go live on DoctorKhoj!",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-amber-100 bg-amber-50">
              <CardContent className="p-5">
                <h3 className="font-bold text-amber-800 mb-2">📞 Need Help?</h3>
                <p className="text-sm text-amber-700 mb-3">
                  Our team is happy to assist with registration. Call or WhatsApp us:
                </p>
                <a href="https://wa.me/911800123456" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4" /> WhatsApp: +91 1800 123 456
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-5">
                <p className="text-xs text-slate-400 italic text-center leading-relaxed">
                  "An Initiative by an IIT Patna Student for Palamu Healthcare — bringing quality healthcare discovery to every family."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
