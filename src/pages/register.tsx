import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Stethoscope, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/store/app";
import { toast } from "sonner";

export default function Register() {
  const nav = useNavigate();
  const updateProfile = useProfile((s) => s.update);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/home`, data: { name, phone } },
      });
      if (error) throw error;
      updateProfile({ name, email, phone });
      toast.success("Account created — check your email if confirmation is required.");
      nav("/home");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const fields = [
    { id: "name", label: "Full name", value: name, set: setName, type: "text", placeholder: "Jane Doe" },
    { id: "email", label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
    { id: "phone", label: "Phone", value: phone, set: setPhone, type: "tel", placeholder: "+91 9000000000" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 grid place-items-center text-primary-foreground p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-sm">
            <Stethoscope className="w-12 h-12 mb-5" />
            <h2 className="text-4xl font-display font-bold leading-tight">Care that fits your life.</h2>
            <p className="mt-4 opacity-90 text-lg">Join 1.2M+ Indians using DoctorKhoj for verified appointments and AI-assisted care.</p>
          </motion.div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-4"
        >
          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to sign in
          </Link>

          <div>
            <h1 className="text-3xl font-display font-bold">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start booking premium care today.</p>
          </div>

          {fields.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} type={f.type} required value={f.value} onChange={(e) => f.set(e.target.value)} className="mt-1.5 h-12 rounded-xl" placeholder={f.placeholder} />
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}>
            <Label htmlFor="pwd">Password</Label>
            <div className="relative mt-1.5">
              <Input id="pwd" type={show ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl pr-11" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type={show ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
          </motion.div>

          <Button disabled={loading} className="w-full h-12 rounded-xl bg-gradient-primary border-0 shadow-glow text-base font-semibold mt-2">
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
