import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="container mx-auto py-24 text-center">
      <h1 className="text-7xl font-display font-bold gradient-text">404</h1>
      <p className="text-muted-foreground mt-2">We couldn't find that page.</p>
      <Button asChild className="mt-6 rounded-full bg-gradient-primary border-0"><Link to="/">Back to home</Link></Button>
    </div>
  );
}
