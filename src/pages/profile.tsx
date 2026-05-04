import { useRef, useState } from "react";
import { useAuth, getInitials } from "@/context/auth";
import { useProfile, useAppointments } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Edit3, Check, Calendar, Droplet, Weight, Ruler, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/animations";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const { profile, update } = useProfile();
  const { items } = useAppointments();
  const upcoming = items.filter((i) => i.status === "upcoming").slice(0, 3);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { update({ avatarDataUrl: r.result as string }); toast.success("Photo updated"); };
    r.readAsDataURL(f);
  };

  const save = () => { update(draft); setEdit(false); toast.success("Profile saved"); };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Reveal>
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-6 sm:p-8 shadow-elevated relative overflow-hidden mb-6">
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full ring-4 ring-white/30 overflow-hidden bg-white/15 grid place-items-center text-2xl font-display font-bold">
                {profile.avatarDataUrl
                  ? <img src={profile.avatarDataUrl} alt="" className="w-full h-full object-cover" />
                  : getInitials(profile.name || user?.email)}
              </div>
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary grid place-items-center shadow-card hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatar} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-display font-bold">{profile.name || "Guest"}</h1>
              <p className="opacity-90 text-sm">{user?.email}</p>
              <p className="text-xs opacity-75 mt-1">Member since {user && new Date(user.created_at).toLocaleDateString("en-IN")}</p>
            </div>
            <Button variant="secondary" onClick={() => { setDraft(profile); setEdit((e) => !e); }} className="rounded-full">
              {edit ? <><Check className="w-4 h-4 mr-1" />Done</> : <><Edit3 className="w-4 h-4 mr-1" />Edit</>}
            </Button>
          </div>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold mb-4">Personal info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ["name", "Full name", "text"],
                ["phone", "Phone", "tel"],
                ["age", "Age", "number"],
                ["bloodGroup", "Blood group", "text"],
                ["weightKg", "Weight (kg)", "number"],
                ["heightCm", "Height (cm)", "number"],
              ] as const).map(([k, label, type]) => (
                <div key={k}>
                  <Label>{label}</Label>
                  {edit ? (
                    <Input type={type} value={(draft as any)[k] ?? ""} onChange={(e) => setDraft({ ...draft, [k]: type === "number" ? (e.target.value ? Number(e.target.value) : "") : e.target.value })} className="mt-1.5 rounded-xl h-11" />
                  ) : (
                    <p className="mt-1.5 px-3 h-11 rounded-xl bg-muted/50 grid items-center text-sm">{(profile as any)[k] || "—"}</p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <Label>Allergies</Label>
                {edit
                  ? <Input value={draft.allergies} onChange={(e) => setDraft({ ...draft, allergies: e.target.value })} className="mt-1.5 rounded-xl h-11" />
                  : <p className="mt-1.5 px-3 h-11 rounded-xl bg-muted/50 grid items-center text-sm">{profile.allergies || "—"}</p>}
              </div>
            </div>
            {edit && <Button onClick={save} className="mt-4 rounded-full bg-gradient-primary border-0 shadow-glow">Save changes</Button>}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold mb-4">Medical history timeline</h3>
            <ol className="relative border-l border-border ml-3 space-y-5">
              {[
                { date: "May 2026", t: "Annual health check", d: "All vitals normal." },
                { date: "Feb 2026", t: "Cardiology consult", d: "Routine ECG, no concerns." },
                { date: "Nov 2025", t: "Vaccination", d: "Flu shot administered." },
              ].map((e) => (
                <li key={e.t} className="ml-5">
                  <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-gradient-primary ring-2 ring-background" />
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                  <p className="font-medium">{e.t}</p>
                  <p className="text-sm text-muted-foreground">{e.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-5 shadow-elevated">
            <p className="text-xs opacity-80 uppercase tracking-wider">Health card</p>
            <p className="font-display font-bold text-lg mt-1">{profile.name || "Patient"}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><Droplet className="w-3.5 h-3.5 inline mr-1" />{profile.bloodGroup}</div>
              <div>Age {profile.age || "—"}</div>
              <div><Weight className="w-3.5 h-3.5 inline mr-1" />{profile.weightKg || "—"} kg</div>
              <div><Ruler className="w-3.5 h-3.5 inline mr-1" />{profile.heightCm || "—"} cm</div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-90 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /><span>Allergies: {profile.allergies}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" />Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming visits.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50">
                    <img src={a.doctorPhoto} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{a.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button asChild variant="outline" className="w-full rounded-full mt-3"><Link to="/appointments">View all</Link></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
