# Overview

Brews and Bytes is a comprehensive platform designed to revolutionize remote workspace discovery by connecting digital nomads and remote workers with optimal coffee shop workspaces. The application focuses on Somerset West, South Africa, and provides data-driven insights including real-time WiFi speed testing, vibe ratings, and community-driven reviews to help professionals find their perfect work environment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom brand colors (Coffee Brown, Tech Blue, Vibe Yellow, Cream White)
- **Fonts**: Montserrat for headings and Pacifico for playful elements
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth interactions and transitions
- **Maps Integration**: Google Maps API for location services and coffee shop discovery

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints for contact forms, signups, and coffee shop data
- **Development**: Hot reloading with Vite integration for seamless development experience

## Data Schema Design
- **Users Table**: User authentication and profile management
- **Contacts Table**: Contact form submissions with timestamping
- **Signups Table**: Waitlist management with user preferences and tribe affiliations
- **Subscribers Table**: Newsletter subscription management
- **Coffee Shops Table**: Comprehensive workspace data including WiFi speeds, amenities, and location details

## Feature Implementation
- **WiFi Speed Testing**: Integration with speed testing SDKs (planned partnerships with Ookla Speedtest and Netflix Fast.com)
- **Vibe Rating System**: Community-driven atmosphere categorization (Quiet Zen, Chatty Buzz, Creative Chaos, Focus Factory)
- **Tribe Matching**: Professional community features connecting like-minded remote workers
- **Google Places Integration**: Coffee shop discovery and verification using Google Places API
- **Real-time Data**: Live WiFi performance metrics with historical tracking

# External Dependencies

## Third-Party Services
- **Database**: Neon Serverless PostgreSQL for scalable data storage
- **Maps & Location**: Google Maps API and Google Places API for location services
- **Speed Testing**: Planned integrations with Ookla Speedtest SDK and Netflix Fast.com API
- **Email Services**: Future integration planned for newsletter and notification systems

## Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: TypeScript for enhanced development experience
- **Code Quality**: ESBuild for production bundling
- **Validation**: Zod for runtime type validation and form schemas

## Frontend Libraries
- **UI Framework**: React 18 with modern hooks
- **Component System**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod resolvers
- **Animation**: Framer Motion for enhanced user interactions
- **Charts**: Recharts for data visualization
- **Maps**: React Leaflet as fallback option to Google Maps

## Backend Dependencies
- **Web Framework**: Express.js for API endpoints
- **Database**: Drizzle ORM with PostgreSQL adapter
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: TSX for TypeScript execution in development