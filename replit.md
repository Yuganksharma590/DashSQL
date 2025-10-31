# GreenMove Sustainability Ecosystem

## Overview

GreenMove is a sustainability tracking platform that helps users monitor their carbon footprint, log eco-friendly activities, earn rewards for sustainable actions, and receive personalized sustainability coaching. The application gamifies environmental responsibility through a points-based reward system and provides data visualizations to track progress over time.

**Core Features:**
- Carbon footprint tracking across multiple categories (Transport, Energy, Waste, Water, Food)
- Activity logging with automatic carbon savings calculations
- Rewards and achievements system with leveling mechanics
- Rule-based eco-coach chatbot for sustainability tips
- Analytics dashboard with charts and graphs
- Interactive map showing locations of eco-friendly activities
- Light/dark theme support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript, built using Vite as the build tool and development server.

**Routing:** Uses Wouter for client-side routing, a lightweight alternative to React Router. Main routes include Dashboard, Carbon Tracker, Activities, Eco Coach, Rewards, Analytics, and Map views.

**State Management:** TanStack Query (React Query) handles all server state management, data fetching, and caching. No global client state management library is used; component-level state is managed with React hooks (useState, useEffect).

**UI Components:** Comprehensive component library based on shadcn/ui (Radix UI primitives with Tailwind CSS). The design system follows the "New York" style variant with custom sustainability-focused color scheme featuring earth tones and vibrant greens.

**Styling:** Tailwind CSS with custom configuration for sustainability theme. Design guidelines emphasize optimistic sustainability with forest greens, leaf greens, sky blues, and sunshine yellows. Custom CSS variables enable seamless light/dark theme switching.

**Forms:** React Hook Form with Zod validation for all form handling, providing type-safe form validation and error handling.

**Data Visualization:** Recharts library for rendering analytics charts (bar charts, line charts, pie charts) showing carbon savings trends and category breakdowns.

**Maps:** Leaflet integration for displaying activity locations on an interactive map with OpenStreetMap tiles.

### Backend Architecture

**Runtime:** Node.js with Express.js framework running in ESM (ES Modules) mode.

**API Design:** RESTful API with JSON payloads. Main endpoints include:
- `/api/user` - User profile management
- `/api/activities` - Activity logging and retrieval
- `/api/rewards` - Rewards and achievements
- `/api/chat` - Eco-coach chatbot messages

**Data Storage:** Currently uses in-memory storage (MemStorage class) implementing a defined storage interface (IStorage). The application is designed to support database migration through the interface pattern - the storage layer can be swapped for database-backed storage (e.g., Drizzle ORM with PostgreSQL) without changing business logic.

**Session Management:** Uses connect-pg-simple for PostgreSQL-backed session storage (when database is configured), with session data stored separately from application data.

**Validation:** Zod schemas defined in shared directory validate both incoming requests and database insertions, ensuring type safety across the full stack.

**Eco-Coach Logic:** Rule-based chatbot system (no AI API required) that pattern-matches user messages and provides curated sustainability tips across categories: energy, waste, water, carbon footprint, transportation, and food.

### Data Schema Design

**Database ORM:** Drizzle ORM configured for PostgreSQL with schema-first approach. Schema definitions use Drizzle's type-safe query builder.

**Core Tables:**
- `users` - User profiles with sustainability metrics (totalPoints, totalCarbonSaved, level)
- `activities` - Eco-friendly activities with category, type, quantity, carbon calculations, points, and optional geolocation
- `rewards` - Achievement records linking to users with reward type, description, icon, and points
- `chatMessages` - Conversation history between users and eco-coach

**Activity Categories:** Predefined categories include Transport, Energy, Waste, Water, and Food. Each activity calculates carbon savings based on activity type and quantity (e.g., biking miles, recycling pounds, solar kWh).

**Points & Gamification:** Activities generate points based on carbon impact. Users level up based on total points accumulated, creating progression mechanics similar to gaming systems.

### Type Safety Strategy

**Shared Types:** All database schemas and API types defined in `/shared/schema.ts` using Drizzle table definitions and Zod schemas. This single source of truth is imported by both frontend and backend.

**Path Aliases:** TypeScript path aliases configured for clean imports:
- `@/*` - Frontend components and utilities
- `@shared/*` - Shared types and schemas
- `@assets/*` - Static assets

**Validation:** Drizzle-Zod integration automatically generates insert/update schemas from database tables, ensuring runtime validation matches compile-time types.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, tooltips, etc.) providing accessibility and keyboard navigation out of the box
- **shadcn/ui**: Pre-styled components built on Radix UI, configured with custom sustainability theme
- **Lucide React**: Icon library used throughout the application for consistent iconography

### Data & State Management
- **TanStack Query**: Server state management, data fetching, caching, and synchronization
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation for forms and API requests

### Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe variant management for component styling
- **clsx / tailwind-merge**: Conditional class name utilities

### Maps & Visualization
- **Leaflet**: Interactive map library with React bindings
- **Recharts**: Declarative chart library built on D3.js primitives
- **date-fns**: Date manipulation and formatting

### Backend Infrastructure
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: TypeScript ORM for PostgreSQL with type-safe queries
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless/edge environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Build Tools
- **Vite**: Fast build tool and development server with HMR
- **esbuild**: JavaScript bundler for production server code
- **TypeScript**: Type system for both frontend and backend

### Development Dependencies
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Notes on Database
The application uses Drizzle ORM configured for PostgreSQL but currently runs with in-memory storage. The `DATABASE_URL` environment variable needs to be set for database features to work. Once configured, run `npm run db:push` to sync the schema to the database.