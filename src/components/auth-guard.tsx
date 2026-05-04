import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return <>{children}</>;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;
  return <>{children}</>;
}
