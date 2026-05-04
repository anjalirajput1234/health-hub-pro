import { useState } from "react";
import { useLocation } from "wouter";
import {
  User, Mail, Phone, Calendar, Droplets, MapPin, Edit3,
  Save, X, LogOut, Shield, ChevronRight, HeartPulse,
  Bell, Lock, Trash2
} from "lucide-react";
import { useAuth, getInitials } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function InfoRow({
  icon: Icon, label, value, empty = "Not set",
}: { icon: React.ElementType; label: string; value: string; empty?: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm font-semibold ${value ? "text-slate-800" : "text-slate-400 italic"}`}>
          {value || empty}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [, navigate] = useLocation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user! });
  const [saved, setSaved] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {
    updateProfile(form);
    localStorage.setItem(`dkuser_${user.email}`, JSON.stringify({ ...user, ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const age = user.dob
    ? Math.floor((Date.now() - new Date(user.dob).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile hero */}
        <div className="relative bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 mb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0"
              style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
            >
              {getInitials(user.name)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-blue-200 text-sm mb-3">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {user.bloodGroup && (
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Droplets className="w-3 h-3 mr-1" /> {user.bloodGroup}
                  </Badge>
                )}
                {user.gender && (
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {user.gender}
                  </Badge>
                )}
                {age && (
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {age} years old
                  </Badge>
                )}
                <Badge className="bg-green-400/30 text-white border-green-300/30 backdrop-blur-sm">
                  <HeartPulse className="w-3 h-3 mr-1" /> Active Patient
                </Badge>
              </div>
            </div>
            <div className="sm:ml-auto flex gap-2">
              {!editing ? (
                <Button
                  size="sm"
                  onClick={() => { setForm({ ...user }); setEditing(true); }}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  variant="outline"
                >
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="bg-white text-primary hover:bg-blue-50 font-bold">
                    <Save className="w-4 h-4 mr-1.5" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name</Label>
                      <Input className="rounded-lg" value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email (cannot change)</Label>
                      <Input className="rounded-lg bg-slate-50" value={form.email} disabled />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Phone Number</Label>
                      <Input className="rounded-lg" type="tel" value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date of Birth</Label>
                      <Input className="rounded-lg" type="date" value={form.dob}
                        onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Gender</Label>
                      <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Blood Group</Label>
                      <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={form.bloodGroup} onChange={(e) => setForm((p) => ({ ...p, bloodGroup: e.target.value }))}>
                        <option value="">Select</option>
                        {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Home Address</Label>
                      <Input className="rounded-lg" placeholder="Daltonganj, Palamu, Jharkhand" value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    <InfoRow icon={User} label="Full Name" value={user.name} />
                    <InfoRow icon={Mail} label="Email Address" value={user.email} />
                    <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                    <InfoRow icon={Calendar} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""} />
                    <InfoRow icon={User} label="Gender" value={user.gender} />
                    <InfoRow icon={Droplets} label="Blood Group" value={user.bloodGroup} />
                    <InfoRow icon={MapPin} label="Address" value={user.address} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Quick links */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {[
                  { icon: Calendar, label: "My Appointments", href: "/dashboard", color: "text-blue-500" },
                  { icon: HeartPulse, label: "AI Symptom Checker", href: "/chatbot", color: "text-pink-500" },
                  { icon: Bell, label: "Notifications", href: "#", color: "text-amber-500" },
                  { icon: Lock, label: "Security Settings", href: "#", color: "text-green-500" },
                ].map(({ icon: Icon, label, href, color }) => (
                  <a key={label} href={href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group border-b last:border-b-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="shadow-sm border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-600">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs"
                  onClick={() => {
                    if (confirm("Are you sure? This will permanently delete your account.")) {
                      localStorage.removeItem(`dkuser_${user.email}`);
                      logout();
                      navigate("/");
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
