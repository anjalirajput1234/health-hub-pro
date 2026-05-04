import { useTheme } from "@/hooks/use-theme";
import { useSettings } from "@/store/app";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/animations";
import { Moon, Sun, Bell, Globe, Shield } from "lucide-react";

function Section({ icon: Icon, title, desc, children }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="w-5 h-5" /></div>
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, notifications, setNotif } = useSettings();

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Reveal>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mb-6">Customize your DoctorKhoj experience.</p>
      </Reveal>

      <div className="grid gap-5">
        <Section icon={theme === "dark" ? Moon : Sun} title="Appearance" desc="Switch between light and dark mode.">
          <div className="flex items-center justify-between">
            <Label>Dark mode</Label>
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
        </Section>

        <Section icon={Bell} title="Notifications" desc="Choose how we reach you.">
          {([
            ["email", "Email notifications"],
            ["sms", "SMS reminders"],
            ["push", "Push notifications"],
          ] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <Label>{label}</Label>
              <Switch checked={notifications[k]} onCheckedChange={(v) => setNotif(k, v)} />
            </div>
          ))}
        </Section>

        <Section icon={Globe} title="Language" desc="Choose your preferred language.">
          <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        <Section icon={Shield} title="Privacy" desc="Control your data and visibility.">
          <div className="flex items-center justify-between">
            <Label>Share anonymous health insights</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow personalized recommendations</Label>
            <Switch defaultChecked />
          </div>
        </Section>
      </div>
    </div>
  );
}
