# Matir Poshara (মাটির পশরা) - Technical Documentation

This document provides a comprehensive overview of the Matir Poshara codebase, organized by functional modules.

---

## 1. Core Architecture
Matir Poshara is built using **Next.js 15+ (App Router)** with **TypeScript**. It follows a modular structure to separate concerns between data, logic, and presentation.

### Directory Structure
- `src/app/`: Routing, pages, and API handlers.
- `src/components/`: Reusable UI components.
- `src/models/`: Mongoose schemas and TypeScript interfaces for MongoDB.
- `src/lib/`: Shared utilities (e.g., database connection).
- `src/context/`: Global state management (e.g., Shopping Cart).

---

## 2. Data Models (`src/models/`)
The application uses **Mongoose** for MongoDB object modeling. Each model includes a TypeScript interface for type safety.

| Module | File | Description |
| :--- | :--- | :--- |
| **Product** | `Product.ts` | Stores product details (name, price, category, icon, etc.). Includes a `isBestSelling` flag. |
| **Artisan** | `Artisan.ts` | Profiles of the craftsmen (name, village, experience, story). |
| **Category** | `Category.ts` | Product categories with metadata like `productCount` and `icon`. |
| **Order** | `Order.ts` | Customer orders, including line items, shipping info, and status tracking. |
| **Review** | `Review.ts` | Product ratings and feedback. |

---

## 3. API & Backend (`src/app/api/`)
API routes handle server-side logic and database interactions.

### Public APIs
- `GET /api/search?q=...`: Performs fuzzy search on products.
- `POST /api/orders`: Submits a new customer order.

### Admin APIs (`/api/admin/`)
- `GET/POST /api/admin/products`: Manage product catalog.
- `GET/POST /api/admin/artisans`: Manage artisan profiles.
- `GET /api/admin/orders`: List all orders.
- `PATCH /api/admin/orders/[id]`: Update order status (pending, processing, shipped, etc.).

---

## 4. Frontend & UI (`src/components/`)
UI components are organized by their scope and purpose.

### UI Components (`src/components/ui/`)
Atomic-level components used across the site:
- `ProductCard.tsx`: Displays product summary with "Add to Cart" functionality.
- `ArtisanCard.tsx`: Showcases artisan stories.
- `CategoryCard.tsx`: Navigational card for categories.
- `CartModal.tsx`: The slide-over shopping cart.
- `TrackingModal.tsx`: Order tracking interface for customers.

### Layout & Sections
- `src/components/layout/`: Shared elements like `Header`, `Navbar`, and `Footer`.
- `src/components/sections/`: Large page blocks like the `Hero` section.

---

## 5. State Management (`src/context/`)
Global application state is managed via React Context.

- **CartContext (`CartContext.tsx`)**:
  - Manages `cartItems` in `localStorage`.
  - Provides `addToCart`, `removeFromCart`, and `updateQty` actions.
  - Controls the visibility of `CartModal` and `TrackingModal`.

---

## 6. Database Utility (`src/lib/`)
- **`mongodb.ts`**: Implements a singleton pattern for the Mongoose connection. It uses a global cache to prevent multiple connections during Next.js hot-reloads in development.
- **`seed.ts`**: Contains scripts to populate the database with initial/mock data.

---

## 7. Routing Strategy (`src/app/`)
The App Router is used for both static and dynamic routes:
- `/`: Home page (static with revalidation).
- `/category/[slug]`: Dynamic product listing by category.
- `/product/[id]`: Detailed product view.
- `/search`: Client-side search results (wrapped in `Suspense`).
- `/admin/*`: Protected dashboard for managing store operations.

---

## 8. Styling & Theme
- **CSS**: Tailwind CSS 4.
- **Theme**: Custom colors (Cream, Terracotta, Clay, Leaf) defined in `globals.css` to reflect the traditional "Matir" (Earthen) aesthetic.
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
