import { Link, useLocation, NavLink } from "react-router-dom";
import { Stethoscope, Hospital, Activity, Home, LayoutDashboard, Menu, Moon, Sun, User, LogOut, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, getInitials } from "@/context/auth";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import { toast } from "sonner";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/hospitals", label: "Hospitals", icon: Hospital },
  { to: "/dashboard", label: "Bookings", icon: LayoutDashboard },
  { to: "/chatbot", label: "AI Check", icon: Activity },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const isAuthRoute = pathname === "/login";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur-xl bg-background/75">
        <div className="container mx-auto h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">DoctorKhoj</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="navpill"
                        className="absolute inset-0 rounded-full bg-primary/10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{it.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 rounded-full pr-3 pl-1 py-1 border border-border hover:border-primary/50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">
                      {getInitials(user.email)}
                    </div>
                    <span className="text-sm font-medium hidden md:inline">{user.email?.split("@")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/profile"><User className="w-4 h-4 mr-2" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />My bookings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut().then(() => toast.success("Signed out"))} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden sm:inline-flex rounded-full bg-gradient-primary shadow-glow border-0">
                <Link to="/login">Sign in</Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="mt-8 flex flex-col gap-1">
                  {navItems.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        }`
                      }
                    >
                      <it.icon className="w-4 h-4" /> {it.label}
                    </NavLink>
                  ))}
                  {!user && (
                    <Button asChild className="mt-4 rounded-full bg-gradient-primary border-0">
                      <Link to="/login">Sign in</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 lg:pb-0">{children}</main>

      {/* Floating Emergency button */}
      {!isAuthRoute && (
        <a
          href="tel:108"
          className="fixed right-5 bottom-24 lg:bottom-8 z-30 group"
          aria-label="Emergency"
        >
          <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-glow" />
          <span className="relative flex items-center gap-2 bg-destructive text-destructive-foreground px-4 h-12 rounded-full font-semibold shadow-elevated hover:scale-105 transition-transform">
            <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Emergency</span>
          </span>
        </a>
      )}

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[11px] ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <it.icon className="w-5 h-5" />
              {it.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isAuthRoute && (
        <footer className="hidden lg:block border-t border-border/60 mt-20 bg-gradient-soft">
          <div className="container mx-auto py-12 grid grid-cols-4 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center"><Stethoscope className="w-4 h-4 text-primary-foreground" /></div>
                <span className="font-display font-bold">DoctorKhoj</span>
              </div>
              <p className="text-muted-foreground">Premium healthcare access for every Indian family.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Patients</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/doctors" className="hover:text-foreground">Find doctors</Link></li>
                <li><Link to="/hospitals" className="hover:text-foreground">Hospitals</Link></li>
                <li><Link to="/chatbot" className="hover:text-foreground">AI symptom checker</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Account</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground">My bookings</Link></li>
                <li><Link to="/profile" className="hover:text-foreground">Profile</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Emergency</h4>
              <p className="text-muted-foreground">Dial <a href="tel:108" className="text-destructive font-semibold">108</a> for ambulance services anywhere in India.</p>
            </div>
          </div>
          <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} DoctorKhoj. Built with care.</div>
        </footer>
      )}
    </div>
  );
}
