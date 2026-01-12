# ✅ Brews and Bytes – Side Project TODOs

## Core Setup

- [ ] **Use GooglePlaces API** – [/] Data imported from JSON, but dynamic API integration pending
- [ ] **Register Domain & add reCAPTCHA** – [/] Dependency added, implementation in forms pending
- [ ] **Setup Supabase project** – [ ] Currently using SQLite via Drizzle; migration planned

---

## Database & Backend

- [x] **Map out necessary tables** – [x] Comprehensive schema implemented in `schema.ts`
- [x] **Create database tables** – [x] Drizzle migrations and SQLite storage active

---

## User Features

- [x] **Notification board** – [x] Admin-managed notifications live via `NotificationPanel`
- [x] **Integrate navigation links** – [x] Google Maps, Apple Maps, Waze live in `CoffeeShopDetails`
- [x] **Uber deep-link research** – [x] Custom deep-link builder implemented with location preloading
- [ ] **User Reviews and Ratings** - [/] UI mocked in details view; separate DB table pending
- [ ] **Advanced Search and Filtering** - [/] Amenities schema exists; advanced filter UI refinement pending
- [ ] **User Profiles** - [ ] Basic `users` table exists, but profile features (favorites, history) pending
- [ ] **Gamification/Rewards System** - [ ] Pending

---

## Admin & Coffee Shop Owner Features

- [x] **Admin Panel** - [x] Fully functional dashboard for managing shops, blogs, coupons, and notifications
- [ ] **Login for Coffee Shop Owners** - [ ] `adminUsers` roles exist, but owner self-service pending
- [x] **Manage Specials and Coupons** - [x] Schema and Admin UI implemented
- [x] **Image Uploads** - [x] Multer-based upload system and image management live

---

## Marketing & Growth

- [x] **Coffee shop launch campaign** – [x] `LaunchCampaign` page and backend tools (coupons/specials) ready
- [x] **Blog & community content** – [x] Blog management system and community pages live
- [ ] **User growth campaign** – [ ] Pending
- [ ] **Partner outreach** – [ ] Pending

---

## Data Acquisition & Expansion

- [x] **Expansion roadmap** – [x] Roadmap page and rollout plan visible
- [ ] **Automated Data Scraping** - [/] `import-places.ts` utility exists for JSON imports
- [ ] **Hosting migration research** – [/] AWS vs Cloudways feasibility research in progress

---

## Monetization Strategy

- [ ] **Featured Coffee Shops** - Offer paid placements for coffee shops to appear at the top of search results.
- [ ] **Subscription for Owners** - Create a premium subscription for owners with features like analytics, direct messaging, and event posting.
- [ ] **Integration with Delivery Services** - Partner with food delivery services for a commission on orders placed through the platform.
- [ ] **Merchandise** - Sell branded merchandise like mugs, t-shirts, and stickers.


## Icon pack
1. Coffee cup in the shower - Nothing to see here for 4040
2. Coffee cup with a spoon - Pour yourself a cup of coffee
3. Coffee cup with a saucer - Add a splash of flavor
4. Coffee cup with a lid - Keep your caffeine in check
5. Coffee cup with a crab in it, to simpize Rust
6. Coffee cup that uses a flute to make a python appear
7. Coffee cup with multiples -horizontal scaling
8. Coffee cup with 3 shots - vertical scaling
9. Coffee cup that overflows - memory overflow
10. Coffee cup that spills - data loss
11. Coffee cup surrounding by a mout - security group
12. Coffee cup dressed as an agent, ai agent