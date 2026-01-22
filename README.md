# Brews and Bytes: Insights by the crowd for the crowd

A social infrastructure platform for finding and optimizing remote work locations in Somerset West, South Africa. Brews and Bytes leverages **crowdsourced wisdom** to help professionals discover the perfect workspaces while providing businesses with data-driven insights to improve their revenue and infrastructure.

![Brews and Bytes](https://placeholder-for-screenshot.com/brewsandbytes-screenshot.png)

## 📊 Project Vision
View our latest project presentation and strategic roadmap:
- **[Interactive HTML Presentation](./docs/Brews_and_Bytes_Presentation.html)** (Best for viewing)
- **[Executive Summary (Markdown)](./docs/Brews_and_Bytes_Presentation.md)**

## Core Strategy
1. **Phase 1: Crowdsourcing**: Initial value through community-contributed metrics (WiFi, noise, atmosphere).
2. **Phase 2: Targeted Feedback**: Using questionnaires to identify "pain points" and understand why specific spaces are avoided.
3. **Phase 3: Business Solutions**: Partnering with cafes to optimize revenue and WiFi (e.g., dead spot scanning and placement optimization).

## Features

- **Interactive Map**: Locate and explore workspaces across Somerset West.
- **Crowdsourced Metrics**: Real-time community data on:
  - Internet Speed (Mbps)
  - Vibe & Ambiance
  - Noise Levels
  - Parking Availability
- **Subjective Insights**: Targeted feedback via questionnaires to identify workspace blockers.
- **Business Intelligence**: Data-driven recommendations for coffee shop owners to attract remote workers.
- **Tribe System**: Find locations popular among your professional "tribe":
  - Code Conjurers (Developers)
  - Word Weavers (Writers)
  - Pixel Pixies (Designers)
  - Buzz Beasts (Marketers)
- **Monetization & Promotion**:
  - Advertised Specials & Partner Promotions.
  - Branded Merchandise (Caffeine-fueled tech gear).
  - WiFi Optimization Partnerships.

## Technology Stack

### Frontend
- React.js, Tailwind CSS, Framer Motion
- Recharts for data visualization
- Leaflet/Google Maps for location mapping

### Backend
- Node.js with Express
- SQLite (via Drizzle ORM) for development; planned Supabase migration
- Multer for image management

### Data Analysis
- Python 3.12+
- Libraries: pandas, geopandas, duckdb, pyarrow

## Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Python 3.12+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/brewsandbytes.git
   cd brewsandbytes
   ```

2. Set up the website
   ```bash
   cd website
   npm install
   ```

3. Create a `.env` file in the `website` directory (see `.env.example`).

4. Running the application
   ```bash
   npm run dev
   ```

## 🚢 Deployment (Cloudways)

This project includes automation scripts for deploying to a Linux environment like Cloudways.

### 1. Setup & Installation
Run this once to install global dependencies (like PM2) and project-specific libraries:
```bash
bash scripts/install_deps.sh
```

### 2. Deploy & Launch
Use this to pull the latest code, build the production bundle, and start/reload the app with PM2:
```bash
bash scripts/deploy.sh
```

### 3. Management
Monitor logs or status using the management utility:
```bash
bash scripts/manage.sh status
bash scripts/manage.sh logs
```

## Project Structure

```
brewsandbytes/
├── docs/                   # Presentation and strategy documents
├── website/                # Full-stack web application
│   ├── client/             # React frontend
│   ├── server/             # Node.js/Express backend
│   ├── shared/             # Shared types and schema
│   └── migrations/         # Database migrations
├── architecture.md         # System design diagrams
├── TODO.md                 # Project roadmap status
└── TASKS.md                # Actionable task breakdown
```

## Contributing

We are a "crowd for the crowd" platform! You can chip in by:
1. Submitting real-time WiFi speed tests.
2. Answering questionnaires about your workspace experiences.
3. Suggesting new locations.
4. Developing new visualization tools for our community data.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Somerset West remote work community for their invaluable crowdsourced data.
- Local cafes for providing the "brews" while we provide the "bytes".
