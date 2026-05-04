import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Stethoscope, Hospital, Calendar, MessageCircle, Heart, LayoutDashboard,
  User, Settings, CreditCard, Bell, Phone, LifeBuoy, LogOut, Menu, Moon, Sun,
  Stethoscope as Logo, Pill, FileHeart, Sparkles, MapPin, Activity, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth, getInitials } from "@/context/auth";
import { useTheme } from "@/hooks/use-theme";
import { useNotifs, useProfile } from "@/store/app";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const mainNav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/doctors", label: "Find Doctors", icon: Stethoscope },
  { to: "/hospitals", label: "Hospitals", icon: Hospital },
  { to: "/appointments", label: "My Appointments", icon: Calendar },
  { to: "/chatbot", label: "AI Health Chat", icon: MessageCircle },
  { to: "/saved", label: "Saved Doctors", icon: Heart },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const toolsNav = [
  { to: "/symptom-checker", label: "Symptom Checker", icon: Sparkles },
  { to: "/reminders", label: "Medicine Reminders", icon: Pill },
  { to: "/records", label: "Health Records", icon: FileHeart },
  { to: "/loyalty", label: "Loyalty Points", icon: Activity },
  { to: "/map", label: "Nearby Hospitals", icon: MapPin },
];

const userNav = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/payments", label: "Payments & Billing", icon: CreditCard },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/emergency", label: "Emergency Contacts", icon: Phone },
  { to: "/support", label: "Support / Help", icon: LifeBuoy },
];

const mobileBottomNav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/chatbot", label: "Chat", icon: MessageCircle },
  { to: "/appointments", label: "Visits", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
];

function SidebarLink({ to, label, icon: Icon, onClick }: any) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="w-4 h-4 shrink-0" />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const { profile } = useProfile();
  const unread = useNotifs((s) => s.items.filter((i) => !i.read).length);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    nav("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Logo className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-base font-display font-bold gradient-text leading-none">DoctorKhoj</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Premium care</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-none">
        <div>
          <p className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Navigation</p>
          {mainNav.map((it) => <SidebarLink key={it.to} {...it} onClick={onNav} />)}
        </div>
        <div>
          <p className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tools</p>
          {toolsNav.map((it) => <SidebarLink key={it.to} {...it} onClick={onNav} />)}
        </div>
        <div>
          <p className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Account</p>
          {userNav.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onNav}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`
              }
            >
              <span className="flex items-center gap-3"><it.icon className="w-4 h-4" />{it.label}</span>
              {it.to === "/notifications" && unread > 0 && (
                <Badge className="h-5 px-1.5 text-[10px] bg-destructive text-destructive-foreground border-0">{unread}</Badge>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* User card */}
      <div className="p-3 border-t border-border">
        <div className="rounded-2xl bg-gradient-soft p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-bold overflow-hidden shrink-0">
            {profile.avatarDataUrl
              ? <img src={profile.avatarDataUrl} alt="" className="w-full h-full object-cover" />
              : getInitials(profile.name || user?.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{profile.name || "Patient"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of DoctorKhoj?</AlertDialogTitle>
                <AlertDialogDescription>You'll need to sign in again to access your appointments and records.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">Sign out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const { profile } = useProfile();
  const unread = useNotifs((s) => s.items.filter((i) => !i.read).length);
  const items = useNotifs((s) => s.items);
  const markAllRead = useNotifs((s) => s.markAllRead);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute || !user) {
    // Auth screens: full-bleed, no chrome
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border bg-card/50 backdrop-blur-xl sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SidebarContent onNav={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="h-full px-4 sm:px-6 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/home" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center">
                <Logo className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold gradient-text">DoctorKhoj</span>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} className="rounded-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.span>
                </AnimatePresence>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="w-4 h-4" />
                    {unread > 0 && (
                      <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold grid place-items-center">
                        {unread}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="px-1">Notifications</DropdownMenuLabel>
                    {unread > 0 && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={markAllRead}>
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {items.slice(0, 6).map((n) => (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                        <div className="flex items-center gap-2 w-full">
                          <span className={`w-1.5 h-1.5 rounded-full ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                          <span className="font-medium text-sm flex-1">{n.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-3.5">{n.body}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="justify-center font-medium text-primary">View all</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/profile" className="hidden sm:flex items-center gap-2 rounded-full pr-3 pl-1 py-1 border border-border hover:border-primary/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold overflow-hidden">
                  {profile.avatarDataUrl
                    ? <img src={profile.avatarDataUrl} className="w-full h-full object-cover" alt="" />
                    : getInitials(profile.name || user.email)}
                </div>
                <span className="text-sm font-medium hidden md:inline truncate max-w-[120px]">
                  {profile.name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Emergency button */}
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="grid grid-cols-5 h-16">
          {mobileBottomNav.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[11px] relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="mob-active"
                      className="absolute top-0 inset-x-6 h-0.5 rounded-full bg-gradient-primary"
                    />
                  )}
                  <it.icon className="w-5 h-5" />
                  {it.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
