// Mock dataset used when VITE_API_URL backend is not reachable.
// Mirrors shapes from the original /lib/api-client/api.schemas.ts.

export type MockDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  feeINR: number;
  city: string;
  state: string;
  district: string;
  hospital: string;
  availableToday: boolean;
  nextSlot: string;
  photo: string;
  bio: string;
  languages: string[];
};

const photos = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&q=80",
  "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&q=80",
];

const specializations = [
  "Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic", "Neurologist",
  "Gynecologist", "ENT Specialist", "Dentist", "Psychiatrist", "General Physician",
];

const cities = [
  ["Daltonganj", "Palamu", "Jharkhand"],
  ["Ranchi", "Ranchi", "Jharkhand"],
  ["Patna", "Patna", "Bihar"],
  ["Delhi", "New Delhi", "Delhi"],
  ["Mumbai", "Mumbai Suburban", "Maharashtra"],
  ["Bengaluru", "Bengaluru Urban", "Karnataka"],
];

const names = [
  "Dr. Aarav Sharma", "Dr. Priya Mehta", "Dr. Rohan Verma", "Dr. Ananya Iyer",
  "Dr. Vikram Singh", "Dr. Sneha Reddy", "Dr. Karthik Nair", "Dr. Meera Joshi",
  "Dr. Arjun Kapoor", "Dr. Ishita Bose", "Dr. Rahul Khanna", "Dr. Neha Gupta",
];

export const MOCK_DOCTORS: MockDoctor[] = Array.from({ length: 24 }).map((_, i) => {
  const c = cities[i % cities.length];
  return {
    id: `doc_${i + 1}`,
    name: names[i % names.length],
    specialization: specializations[i % specializations.length],
    qualifications: ["MBBS", "MD", "DNB", "MS"].slice(0, 2 + (i % 3)).join(", "),
    experienceYears: 4 + (i % 22),
    rating: Number((4 + (i % 10) / 10).toFixed(1)),
    reviewsCount: 48 + i * 17,
    feeINR: 300 + (i % 8) * 100,
    city: c[0],
    district: c[1],
    state: c[2],
    hospital: ["Apollo Clinic", "Sadar Hospital", "Medanta", "AIIMS", "Fortis"][i % 5],
    availableToday: i % 3 !== 0,
    nextSlot: ["Today 4:30 PM", "Today 6:15 PM", "Tomorrow 10:00 AM", "Tomorrow 2:00 PM"][i % 4],
    photo: photos[i % photos.length],
    bio: "Dedicated practitioner committed to evidence-based, compassionate care. Trusted by thousands of patients across the region.",
    languages: ["English", "Hindi", i % 2 ? "Bengali" : "Tamil"],
  };
});

export const SPECIALIZATIONS = [
  { name: "General", icon: "🩺" },
  { name: "Cardiology", icon: "❤️" },
  { name: "Dermatology", icon: "✨" },
  { name: "Pediatrics", icon: "🧸" },
  { name: "Orthopedic", icon: "🦴" },
  { name: "Neurology", icon: "🧠" },
  { name: "Gynecology", icon: "🌸" },
  { name: "ENT", icon: "👂" },
  { name: "Dentist", icon: "🦷" },
  { name: "Psychiatry", icon: "🧘" },
  { name: "Eye Care", icon: "👁️" },
  { name: "Diabetes", icon: "🩸" },
];

export const STATES = ["Jharkhand", "Bihar", "Delhi", "Maharashtra", "Karnataka"];
