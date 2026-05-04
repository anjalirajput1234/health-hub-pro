import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Heart, Calendar, GraduationCap, Languages, IndianRupee, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_DOCTORS } from "@/lib/mock-data";
import { useFavorites } from "@/store/favorites";
import { motion } from "framer-motion";

const days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});
const slotsByDay = ["10:00 AM", "11:30 AM", "2:15 PM", "4:45 PM", "6:00 PM"];

const reviews = [
  { name: "Rohit K.", rating: 5, text: "Extremely knowledgeable and patient. Took time to explain everything.", date: "2 days ago" },
  { name: "Priya S.", rating: 5, text: "Best experience I've had with a doctor. Highly recommend.", date: "1 week ago" },
  { name: "Amit P.", rating: 4, text: "Good consultation, slightly long wait but worth it.", date: "3 weeks ago" },
];

export default function DoctorDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const fav = useFavorites();
  const doc = MOCK_DOCTORS.find((d) => d.id === id) || MOCK_DOCTORS[0];
  const isFav = fav.has(doc.id);

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="mb-4 -ml-2"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Main */}
        <div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card relative overflow-hidden">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex flex-col sm:flex-row gap-6">
              <img src={doc.photo} alt={doc.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-background shadow-elevated" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold">{doc.name}</h1>
                    <p className="text-primary font-medium">{doc.specialization}</p>
                    <p className="text-sm text-muted-foreground mt-1">{doc.qualifications}</p>
                  </div>
                  <Button
                    variant="outline" size="icon" className="rounded-full shrink-0"
                    onClick={() => fav.toggle(doc.id)}
                    aria-label="Save"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-warning/15 text-warning border-warning/20"><Star className="w-3 h-3 mr-1 fill-warning" />{doc.rating} • {doc.reviewsCount} reviews</Badge>
                  <Badge variant="outline"><Award className="w-3 h-3 mr-1" />{doc.experienceYears} yrs experience</Badge>
                  <Badge variant="outline"><MapPin className="w-3 h-3 mr-1" />{doc.hospital}, {doc.city}</Badge>
                  {doc.availableToday && <Badge className="bg-secondary/15 text-secondary border-secondary/20">Available today</Badge>}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList className="rounded-full bg-muted p-1">
              <TabsTrigger value="about" className="rounded-full">About</TabsTrigger>
              <TabsTrigger value="availability" className="rounded-full">Availability</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-5">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <div>
                  <h3 className="font-display font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doc.bio}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Qualifications</p>
                      <p className="font-medium">{doc.qualifications}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Languages className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Languages</p>
                      <p className="font-medium">{doc.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="availability" className="mt-5">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Pick a date</h3>
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                  {days.map((d, i) => (
                    <button key={i} className={`shrink-0 w-16 py-3 rounded-xl border text-center transition-colors ${i === 0 ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}>
                      <p className="text-[10px] uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</p>
                      <p className="text-lg font-display font-bold">{d.getDate()}</p>
                      <p className="text-[10px] text-muted-foreground">{d.toLocaleDateString("en", { month: "short" })}</p>
                    </button>
                  ))}
                </div>
                <h4 className="font-medium mt-6 mb-3 text-sm">Available slots</h4>
                <div className="flex flex-wrap gap-2">
                  {slotsByDay.map((s) => (
                    <button key={s} className="px-4 py-2 rounded-full border border-border text-sm hover:border-primary hover:bg-primary/5 transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-5">
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.name} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">{r.name[0]}</div>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-warning text-sm">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-warning" />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{r.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Consultation fees</p>
            <p className="text-3xl font-display font-bold mt-1 flex items-center"><IndianRupee className="w-6 h-6" />{doc.feeINR}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Next slot</span><span className="font-medium text-secondary">{doc.nextSlot}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="font-medium">In-clinic & Video</span></div>
            </div>
            <Button asChild className="w-full mt-5 h-12 rounded-xl bg-gradient-primary border-0 shadow-glow text-base font-semibold">
              <Link to={`/book/${doc.id}`}>Book appointment</Link>
            </Button>
            <Button variant="outline" className="w-full mt-2 h-11 rounded-xl">
              <MessageSquare className="w-4 h-4 mr-2" /> Message clinic
            </Button>
          </div>
        </aside>
      </motion.div>
    </div>
  );
}
