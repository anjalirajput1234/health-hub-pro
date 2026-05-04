import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created — check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        nav("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 grid place-items-center text-primary-foreground p-12">
          <div className="max-w-sm">
            <Stethoscope className="w-10 h-10 mb-4" />
            <h2 className="text-3xl font-display font-bold">Care that fits your life.</h2>
            <p className="mt-3 opacity-90">Join 1.2M Indians using DoctorKhoj for verified appointments and AI-assisted health checks.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-3xl font-display font-bold">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
            <p className="text-sm text-muted-foreground mt-1">{mode === "signin" ? "Sign in to manage your appointments." : "Start booking premium care today."}</p>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <Button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary border-0 shadow-glow">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "signin" ? "New to DoctorKhoj?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-medium">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
          <p className="text-xs text-center text-muted-foreground"><Link to="/" className="hover:text-foreground">← Back to home</Link></p>
        </form>
      </div>
    </div>
  );
}
