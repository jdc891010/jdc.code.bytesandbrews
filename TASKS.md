# 📋 Brews and Bytes – Detailed Task Roadmap

This document breaks down the remaining items from `TODO.md` into actionable tasks with ROI analysis and execution prompts.

---

## Phase 1: Infrastructure & Trust (High ROI - Core Stability)

### 1. reCAPTCHA Implementation
- **ROI**: **High**. Prevents bot spam in contact forms and signups, ensuring lead quality and system security.
- **Actions Required**:
    - Sign up for Google reCAPTCHA keys.
    - Update `.env` with site and secret keys.
    - Integrate `react-google-recaptcha` into `ContactForm.tsx` and `SignUpForm.tsx`.
    - Implement server-side validation in `server/routes.ts`.
- **Completion Prompt**: 
    > "Integrate Google reCAPTCHA v2 into the Contact and Signup forms. Use the existing `react-google-recaptcha` dependency. Update the backend routes in `server/routes.ts` to verify the reCAPTCHA token before processing form submissions."

### 2. Supabase Migration
- **ROI**: **Medium-High**. Provides a production-ready PostgreSQL database with built-in Auth and Real-time capabilities, replacing the local SQLite file.
- **Actions Required**:
    - Set up Supabase project and get connection string.
    - Update `drizzle.config.ts` to point to Postgres.
    - Run migrations to recreate schema.
    - update `server/storage.ts` or create a `supabase-storage.ts` implementation.
- **Completion Prompt**:
    > "Migrate the project from SQLite to Supabase (PostgreSQL). Update the Drizzle configuration and storage implementation to use the Supabase connection string from environment variables. Ensure the existing `schema.ts` is compatible with PostgreSQL types."

---

## Phase 2: User Engagement (High ROI - Retention)

### 3. Persistent User Reviews & Ratings
- **ROI**: **Extreme**. User-generated content is the lifeblood of this platform. It builds trust and provides the data for the "Composite Score".
- **Actions Required**:
    - Add `reviews` table to `schema.ts` (id, user_id, coffee_shop_id, rating, comment, sentiment).
    - Create a Review component for the `CoffeeShopDetails` modal.
    - Add API route `POST /api/reviews`.
    - Update the score calculation logic to use real DB data instead of mocks.
- **Completion Prompt**:
    > "Implement a persistent reviews system. Create a `reviews` table in `schema.ts` with ratings (1-5) and comments. Update `CoffeeShopDetails.tsx` to allow logged-on users to submit reviews and display the real review history instead of mock data. Re-calculate the shop's average rating based on these DB entries."

### 4. Targeted Questionnaires (Pain Points)
- **ROI**: **High**. Understand why users *avoid* certain spots to build a case for business improvements.
- **Actions Required**:
    - Create a `questionnaires` table (user_id, coffee_shop_id, reason_ignored, infrastructure_gaps).
    - Build a "Vibe Check" followup trigger for active members.
    - Add a "Tell us why this place didn't work for you" feedback loop in the UI.
- **Completion Prompt**:
    > "Add a 'Pain Point' feedback system. Create a schema for user questionnaires that focus on why a workspace was unsuitable (e.g., dead spots, lack of power, noise). Integrate this as a subtle feedback prompt on the coffee shop cards or in the user profile area."

### 5. Advanced Filter UI
- **ROI**: **High**. Helps users find specific workspaces (e.g., "fast wifi + power outlets").
- **Actions Required**:
    - Create a filter sidebar or drawer on the `Home` page.
    - map UI checkboxes to the `amenities` JSON field in the database.
    - Update the `GET /api/coffee-shops` endpoint to support filtering by amenity and wifi speed.
- **Completion Prompt**:
    > "Build an advanced filtering system on the Home page. Allow users to filter the list of coffee shops by amenities (Power, WiFi, Parking) and minimum WiFi speed. Ensure the filters perform a server-side query against the `amenities` JSON column in the `coffee_shops` table."

---

## Phase 3: Monetization & Partnership (Medium ROI - Sustainability)

### 6. Advertised Specials & Paid Placement
- **ROI**: **High (Direct Revenue)**. Businesses pay a small fee to highlight their deals to the community.
- **Actions Required**:
    - Add `is_promoted` to `specials` table.
    - Create a "Promoted Specials" carousel on the Home page.
    - Update Admin Dashboard to manage payments/promoted status for specials.
- **Completion Prompt**:
    > "Implement Promoted Specials. Add a 'promoted' flag to the specials schema. Create a high-visibility UI section on the Home page to display these promoted deals. Add a simple toggle in the Admin Dashboard to manage which specials are highlighted for a fee."

### 7. WiFi Optimization Consulting (Business Solutions)
- **ROI**: **Medium**. Providing data-driven insights to cafes, potentially partnering with WiFi hardware companies.
- **Actions Required**:
    - Create a "Business Health" report view in the Admin/Owner Portal using crowdsourced data.
    - Identify "Dead Spots" in the data and flag them for shop owners.
    - Integrate a "Request WiFi Optimization" lead-gen form for owners.
- **Completion Prompt**:
    > "Develop a 'WiFi Dead Spot' analysis tool for the Owner Portal. Use community-submitted speed tests to map out connectivity issues within a shop. Add a call-to-action for owners to request a professional optimization consultation through our partners."

### 8. Merchandise Integration
- **ROI**: **Low-Medium (Brand Loyalty)**. Selling mugs, gear, and apparel to the community.
- **Actions Required**:
    - Create a simple `Merch` page or dialog.
    - Integrate a basic checkout (e.g., Stripe) or a "Join the Waitlist" for upcoming items.
- **Completion Prompt**:
    > "Launch the 'B&B Gear' shop. Create a new Merch page showcasing branded items like mugs and tech stickers. For the MVP, implement a 'Notify me on Launch' waitlist form to gauge interest before full e-commerce integration."

---

## Phase 4: Automation & Scale (Low-Medium ROI - Scalability)

### 9. Business Insight Reporting (B2B)
- **ROI**: **Medium**. Automated reports for owners summarizing why people visit (or avoid) them.
- **Actions Required**:
    - Implement a PDF/Email report generator summarizing community feedback (Tribe trends, WiFi consistency).
    - Add a "Claim this Business" flow with a free sample report.
- **Completion Prompt**:
    > "Create an automated 'Community Insight Report' for coffee shop owners. This report should aggregate tribe activity, WiFi speed trends over time, and common 'pain points' from user questionnaires."
