# Health Hub Pro

I'm uploading the full source code of my existing healthcare web app called "DoctorKhoj" (built on Replit). 

Please analyze the existing code and completely redesign + improve the UI while keeping all the core features and functionality intact.

---

🎯 GOAL:

Transform this into a premium, modern healthcare platform that feels like a mix of Practo + Apollo 247 + a top SaaS dashboard.

---

🎨 DESIGN SYSTEM:

Colors:

- Primary: Deep Medical Blue (#0A6EBD)

- Secondary: Health Green (#00B894)

- Accent: Soft Teal (#00CEC9)

- Background: Off-white (#F8FAFC) with subtle gradients

- Dark Mode: #0F1117 base with card surfaces at #1A1D27

Typography:

- Headings: "Sora" or "Plus Jakarta Sans" (bold, modern)

- Body: "DM Sans" (clean, readable)

- Avoid: Inter, Roboto, Arial

Aesthetic:

- Glassmorphism cards with soft shadows

- Smooth gradients (blue → teal)

- Rounded corners (border-radius: 16–24px)

- Micro-animations on hover and page load

- Apple-level smoothness

---

📋 PAGES TO REDESIGN:

1. Homepage:

   - Hero section with animated floating search bar

   - "Find Doctor Near You" with location detection UI

   - Specialization filter chips (horizontal scroll on mobile)

   - Featured doctors grid

   - Stats section (doctors count, cities, etc.)

2. Doctor Listing Page:

   - Sidebar filters: State, District, Specialization, Rating, Fees, Availability

   - Doctor cards with: photo, name, specialty, experience, rating stars, "Available Today" badge, fees, Book Now button

   - Skeleton loading UI while fetching

   - Sort by: Rating / Experience / Fees

3. Doctor Detail / Profile Page:

   - Full profile with photo, bio, qualifications

   - Availability calendar UI

   - Reviews & Ratings section

   - "Book Appointment" CTA button (UI only)

   - Save/Favorite button

4. Booking Page (UI only):

   - Date & time slot picker

   - Patient details form

   - Confirm booking button with animation

---

✨ FEATURES TO ADD/IMPROVE:

- Smart search bar with auto-suggestions (debounced)

- Dark mode toggle (top-right)

- Mobile sticky bottom navigation

- Emergency Quick Access button (floating, red)

- Smooth page transitions

- Shimmer skeleton loading

- Toast notifications (success/error)

- Save/Bookmark doctors (local state)

---

⚙️ TECH STACK:

- React.js + Tailwind CSS

- Framer Motion for animations

- React Router for navigation

- Zustand or Context API for state

- Fully responsive (mobile-first)

- Component-based clean folder structure:

  /components, /pages, /hooks, /utils, /assets

---

📱 RESPONSIVE REQUIREMENTS:

- Mobile: Sticky bottom nav, touch-friendly cards, collapsible filters

- Tablet: 2-column grid

- Desktop: 3-column grid with sidebar

---

🚫 AVOID:

- Generic/basic layouts

- Cluttered UI

- Old Bootstrap-style components

- Purple gradient clichés

- Slow animations

---

Please keep ALL existing data/logic from the uploaded code. Only improve the UI, structure, and add the features listed above. Output a complete, production-ready React app.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/134afa96-4b8e-4853-afd9-657bca39640a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
