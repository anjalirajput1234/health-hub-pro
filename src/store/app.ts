import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------- Profile ----------
export type Profile = {
  name: string;
  email: string;
  phone: string;
  age: number | "";
  bloodGroup: string;
  weightKg: number | "";
  heightCm: number | "";
  allergies: string;
  avatarDataUrl?: string;
};

type ProfileState = {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        name: "Guest User",
        email: "",
        phone: "",
        age: "",
        bloodGroup: "O+",
        weightKg: "",
        heightCm: "",
        allergies: "None",
      },
      update: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
    }),
    { name: "dk_profile" },
  ),
);

// ---------- Appointments ----------
export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  specialization: string;
  date: string; // ISO
  time: string;
  mode: "clinic" | "video";
  status: "upcoming" | "completed" | "cancelled";
  feeINR: number;
  hospital: string;
};

type AppState = {
  items: Appointment[];
  add: (a: Omit<Appointment, "id" | "status">) => Appointment;
  cancel: (id: string) => void;
  complete: (id: string) => void;
};

export const useAppointments = create<AppState>()(
  persist(
    (set) => ({
      items: [],
      add: (a) => {
        const item: Appointment = { ...a, id: `apt_${Date.now()}`, status: "upcoming" };
        set((s) => ({ items: [item, ...s.items] }));
        return item;
      },
      cancel: (id) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, status: "cancelled" } : i)) })),
      complete: (id) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, status: "completed" } : i)) })),
    }),
    { name: "dk_appointments" },
  ),
);

// ---------- Payments ----------
export type Payment = {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "refunded";
  method: string;
};

type PayState = {
  items: Payment[];
  add: (p: Omit<Payment, "id">) => void;
};

export const usePayments = create<PayState>()(
  persist(
    (set) => ({
      items: [
        { id: "p_1", description: "Consultation • Dr. Priya Mehta", amount: 600, date: new Date(Date.now() - 86400000 * 4).toISOString(), status: "paid", method: "UPI" },
        { id: "p_2", description: "Consultation • Dr. Rohan Verma", amount: 800, date: new Date(Date.now() - 86400000 * 12).toISOString(), status: "paid", method: "Card" },
        { id: "p_3", description: "Lab tests booking", amount: 1200, date: new Date(Date.now() - 86400000 * 25).toISOString(), status: "refunded", method: "Card" },
      ],
      add: (p) => set((s) => ({ items: [{ ...p, id: `p_${Date.now()}` }, ...s.items] })),
    }),
    { name: "dk_payments" },
  ),
);

// ---------- Notifications ----------
export type Notif = { id: string; title: string; body: string; date: string; read: boolean; kind: "appointment" | "tip" | "offer" };

type NState = {
  items: Notif[];
  add: (n: Omit<Notif, "id" | "read" | "date">) => void;
  markAllRead: () => void;
  unread: () => number;
};

export const useNotifs = create<NState>()(
  persist(
    (set, get) => ({
      items: [
        { id: "n_1", title: "Appointment reminder", body: "Your visit with Dr. Priya is tomorrow at 4:30 PM.", date: new Date().toISOString(), read: false, kind: "appointment" },
        { id: "n_2", title: "Health tip", body: "Drink at least 2L of water daily for kidney health.", date: new Date(Date.now() - 3600000 * 6).toISOString(), read: false, kind: "tip" },
        { id: "n_3", title: "20% off lab tests", body: "Limited offer this week on full body checkups.", date: new Date(Date.now() - 86400000).toISOString(), read: true, kind: "offer" },
      ],
      add: (n) =>
        set((s) => ({ items: [{ ...n, id: `n_${Date.now()}`, read: false, date: new Date().toISOString() }, ...s.items] })),
      markAllRead: () => set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
      unread: () => get().items.filter((i) => !i.read).length,
    }),
    { name: "dk_notifs" },
  ),
);

// ---------- Medicine reminders ----------
export type Reminder = { id: string; medicine: string; dosage: string; time: string; days: string[]; active: boolean };
type RState = {
  items: Reminder[];
  add: (r: Omit<Reminder, "id" | "active">) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};
export const useReminders = create<RState>()(
  persist(
    (set) => ({
      items: [],
      add: (r) => set((s) => ({ items: [{ ...r, id: `r_${Date.now()}`, active: true }, ...s.items] })),
      toggle: (id) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "dk_reminders" },
  ),
);

// ---------- Health records ----------
export type HealthRecord = { id: string; name: string; type: string; size: number; date: string; dataUrl: string };
type RecState = { items: HealthRecord[]; add: (r: Omit<HealthRecord, "id" | "date">) => void; remove: (id: string) => void };
export const useRecords = create<RecState>()(
  persist(
    (set) => ({
      items: [],
      add: (r) => set((s) => ({ items: [{ ...r, id: `rec_${Date.now()}`, date: new Date().toISOString() }, ...s.items] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "dk_records" },
  ),
);

// ---------- Loyalty ----------
type LState = { points: number; add: (n: number) => void };
export const useLoyalty = create<LState>()(
  persist(
    (set) => ({ points: 240, add: (n) => set((s) => ({ points: s.points + n })) }),
    { name: "dk_loyalty" },
  ),
);

// ---------- Emergency contacts ----------
export type Contact = { id: string; name: string; relation: string; phone: string };
type CState = { items: Contact[]; add: (c: Omit<Contact, "id">) => void; remove: (id: string) => void };
export const useEmergency = create<CState>()(
  persist(
    (set) => ({
      items: [],
      add: (c) => set((s) => (s.items.length >= 3 ? s : { items: [...s.items, { ...c, id: `c_${Date.now()}` }] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "dk_emergency" },
  ),
);

// ---------- Settings ----------
type SState = {
  language: "en" | "hi";
  notifications: { email: boolean; sms: boolean; push: boolean };
  setLanguage: (l: "en" | "hi") => void;
  setNotif: (k: "email" | "sms" | "push", v: boolean) => void;
};
export const useSettings = create<SState>()(
  persist(
    (set) => ({
      language: "en",
      notifications: { email: true, sms: true, push: false },
      setLanguage: (language) => set({ language }),
      setNotif: (k, v) => set((s) => ({ notifications: { ...s.notifications, [k]: v } })),
    }),
    { name: "dk_settings" },
  ),
);
