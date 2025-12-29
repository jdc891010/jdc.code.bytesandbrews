# Database Schema & Code Mapping

This document outlines the database schema for **Brews and Bytes**, its relationships, and how it maps to the application code (Backend API and Frontend Services).

## 1. Database Schema Overview

The database schema is defined using **Drizzle ORM** in [website/shared/schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts).
The application uses **SQLite** for development and is compatible with **PostgreSQL** for production (e.g., Neon).

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    COFFEE_SHOPS ||--o{ SPECIALS : "offers"
    COFFEE_SHOPS ||--o{ FEATURED_SPOTS : "is_featured_as"
    ADMIN_USERS ||--o{ BLOG_POSTS : "authors"
    
    %% Polymorphic Image Relationships (Logical)
    COFFEE_SHOPS ||--o{ IMAGES : "has_images (entity_type='coffee_shop')"
    SPECIALS ||--o{ IMAGES : "has_images (entity_type='special')"
    BLOG_POSTS ||--o{ IMAGES : "has_images (entity_type='blog_post')"
    FEATURED_SPOTS ||--o{ IMAGES : "has_images (entity_type='featured_spot')"

    USERS {
        int id PK
        string username
        string password
    }

    COFFEE_SHOPS {
        int id PK
        string name
        string city "Indexed"
        string google_places_id "Indexed"
        int wifi_speed "Indexed"
        json opening_hours
        json amenities
    }

    SPECIALS {
        int id PK
        int coffee_shop_id FK
        string title
        date start_date
        date end_date
    }

    BLOG_POSTS {
        int id PK
        string title
        string slug "Indexed"
        string status "Indexed"
        int author_id FK
    }

    CONTACTS {
        int id PK
        string email
        string message
    }

    SIGNUPS {
        int id PK
        string email
        string tribe
    }
```

## 2. Data Flow Architecture

Data flows from the database through the storage layer, exposed via Express API routes, and consumed by React services.

```mermaid
flowchart TD
    subgraph Database Layer
        DB[(SQLite DB)]
        Schema["Schema Definition<br/>(shared/schema.ts)"]
        Schema -->|Defines Structure| DB
    end

    subgraph Backend Layer
        Storage["Storage Interface<br/>(server/storage.ts)"]
        Routes["API Routes<br/>(server/routes.ts)"]
        
        DB <-->|CRUD Operations| Storage
        Storage <-->|Data Access| Routes
    end

    subgraph Frontend Layer
        Services["API Services<br/>(client/src/services/*.ts)"]
        Components["React Components<br/>(client/src/pages/*.tsx)"]
        
        Routes <-->|JSON / HTTP| Services
        Services <-->|Async Data| Components
    end
```

## 3. Detailed Table-to-Code Mapping

### Core Tables

| Table Name | Drizzle Definition | API Routes | Frontend Service | Description |
|------------|-------------------|------------|------------------|-------------|
| **coffee_shops** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L75) | `GET /api/coffee-shops`<br>[routes.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/routes.ts#L22) | [coffeeShopApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/coffeeShopApi.ts#L1) | Stores main workspace data. Indexed on `city`, `wifi_speed`. |
| **specials** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L239) | `GET /api/specials` | [coffeeShopApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/coffeeShopApi.ts#L32) | Promotions linked to coffee shops. |
| **featured_spots** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L281) | `GET /api/featured-spots` | [coffeeShopApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/coffeeShopApi.ts#L55) | Monthly featured locations. |
| **blog_posts** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L186) | `GET /api/blog-posts`<br>[routes.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/routes.ts#L301) | [adminApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/adminApi.ts) | Content marketing posts. |

### User Interaction Tables

| Table Name | Drizzle Definition | API Routes | Frontend Service | Update Strategy |
|------------|-------------------|------------|------------------|-----------------|
| **contacts** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L21) | `POST /api/contact`<br>`GET /api/contacts` | [adminApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/adminApi.ts) | Append-only via form. |
| **signups** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L41) | `POST /api/signup`<br>`GET /api/signups` | [adminApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/adminApi.ts) | Append-only via waitlist form. |
| **subscribers** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L61) | `POST /api/subscribe`<br>`GET /api/subscribers` | [adminApi.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/client/src/services/adminApi.ts) | Append-only. |

### Admin & System Tables

| Table Name | Drizzle Definition | API Routes | Description |
|------------|-------------------|------------|-------------|
| **admin_users** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L134) | `/api/admin/*` | Back-office authentication. |
| **notifications** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L214) | `/api/admin/notifications` | System alerts. |
| **images** | [schema.ts](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L305) | `/api/upload` | Polymorphic image storage. |

## 4. Code Block Links

### Schema Definitions
- [User Schema](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L5)
- [Coffee Shop Schema](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L75)
- [Blog Post Schema](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/shared/schema.ts#L186)

### Server Storage Implementation
- [MemStorage Class](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/storage.ts#L96)
- [Coffee Shop Operations](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/storage.ts#L237)

### API Routes
- [Coffee Shop Routes](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/routes.ts#L22)
- [Blog Routes](file:///c:/Users/jdc/Documents/GithubPersonal/jdc.code.brewsandbytes/website/server/routes.ts#L301)
