import { Link, useLocation } from "wouter";
import { Stethoscope, User, Hospital, Activity, HeartPulse, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { useAuth, getInitials } from "@/context/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: HeartPulse },
    { href: "/hospitals", label: "Hospitals", icon: Hospital },
    { href: "/doctors", label: "Doctors", icon: Stethoscope },
    { href: "/dashboard", label: "My Appointments", icon: LayoutDashboard },
    { href: "/chatbot", label: "AI Symptom Checker", icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              DoctorKhoj
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full pr-3 pl-1 py-1 border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name.split(" ")[0]}</p>
                      <p className="text-xs text-slate-500 leading-tight truncate max-w-[100px]">{user.email}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Log in
                </Link>
                <Button asChild>
                  <Link href="/login">Book Appointment</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              {user && (
                <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-slate-50 rounded-xl mt-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}

                {user && (
                  <Link href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                    <User className="w-5 h-5" /> My Profile
                  </Link>
                )}
              </nav>

              <div className="mt-4 px-1 flex flex-col gap-2">
                {user ? (
                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button className="w-full justify-start" asChild>
                      <Link href="/login">Book Appointment</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Floating chatbot widget — hidden on the full chatbot page */}
      {location !== "/chatbot" && <ChatbotWidget />}

      <footer className="bg-slate-900 text-slate-300 py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">DoctorKhoj</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Your trusted healthcare guide in Palamu, Jharkhand. Making quality healthcare accessible to everyone.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/doctors" className="hover:text-blue-400 transition-colors">Find a Doctor</Link></li>
              <li><Link href="/hospitals" className="hover:text-blue-400 transition-colors">Hospitals</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">My Appointments</Link></li>
              <li><Link href="/chatbot" className="hover:text-blue-400 transition-colors">AI Symptom Checker</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Online Booking</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Digital OPD Parchi</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Online Payments</span></li>
              <li><Link href="/join" className="hover:text-blue-400 transition-colors">Join as Partner Hospital</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Helpdesk: +91 1800 123 4567</li>
              <li>Email: support@doctorkhoj.in</li>
              <li>Location: Daltonganj, Palamu, Jharkhand 822101</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} DoctorKhoj. All rights reserved. · An initiative by an IIT Patna student for Palamu, Jharkhand.
        </div>
      </footer>
    </div>
  );
}
