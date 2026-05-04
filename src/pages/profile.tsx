import { useAuth, getInitials } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  if (!user) return (
    <div className="container mx-auto py-16 text-center">
      <p className="text-muted-foreground">Please sign in to view your profile.</p>
      <Button asChild className="mt-4 rounded-full bg-gradient-primary border-0"><Link to="/login">Sign in</Link></Button>
    </div>
  );
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-card text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-display font-bold">
          {getInitials(user.email)}
        </div>
        <h1 className="text-2xl font-display font-bold mt-4">{user.email}</h1>
        <p className="text-sm text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
        <Button variant="outline" onClick={signOut} className="mt-6 rounded-full">Sign out</Button>
      </div>
    </div>
  );
}
