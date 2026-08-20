# Inventory Management System

A full-stack inventory management system for tracking products, suppliers, categories, and stock transactions (purchases, sales, and returns), with JWT-based authentication and role-based access control.

Built with **Spring Boot 4** (Java 21) on the backend and **Angular 18** (standalone components) on the frontend.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Running Tests](#running-tests)
- [Main Functionality](#main-functionality)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Docker](#docker)
- [CI/CD](#cicd)
- [License](#license)

---

## Key Features

- 🔐 JWT-based authentication with role-based authorization (`ADMIN` / `MANAGER`)
- 📦 Product catalog with image upload and category association
- 🏷️ Category and supplier management
- 🔄 Stock transactions: purchases (restock), sales, and returns to supplier, with status tracking
- 📊 Dashboard with charts (transactions by type, amounts, monthly breakdown)
- 📱 Responsive UI with success/error toast notifications
- ✅ Automated tests on both backend (JUnit 5 / Mockito / AssertJ) and frontend (Jasmine / Karma)

---

## Tech Stack

### Backend

| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 4.1.0 |
| Spring Data JPA | (via Spring Boot starter) |
| Spring Security | (via Spring Boot starter) |
| MySQL Connector/J | (via Spring Boot–managed version) |
| JWT (jjwt) | 0.12.6 |
| ModelMapper | 3.1.1 |
| Lombok | (via Spring Boot–managed version) |
| Maven | 3.9.16 (via included Maven Wrapper) |

### Frontend

| Technology | Version |
|---|---|
| Angular | 18.2 |
| TypeScript | 5.5 |
| RxJS | 7.8 |
| @swimlane/ngx-charts | 20.5 |
| Karma / Jasmine | 6.4 / 5.2 |

### Database

- **MySQL**

---

## Architecture

The project is a monorepo with two independent applications:

```
inventory-management-system/
├── backend/    Spring Boot REST API
└── frontend/   Angular SPA
```

**Backend** follows a *package-by-feature* structure: each business domain (`product`, `category`, `supplier`, `transaction`, `user`) contains its own controller, service, DTOs, entity, and repository, with cross-cutting concerns isolated in `common/` (generic exceptions and the API response wrapper) and `security/` (JWT filter, Spring Security configuration).

**Frontend** follows Angular's conventional `core` / `shared` / `features` layout:
- `core/` — singleton services (`ApiService`, `NotificationService`), route guards, the auth HTTP interceptor, and TypeScript models
- `shared/` — reusable, presentation-only components (pagination, the notification toast)
- `features/` — one folder per routed page (login, register, dashboard, product, category, supplier, purchase, sell, transaction, transaction-details, profile)

Communication between frontend and backend is via a REST API (`/api/**`), secured with a stateless JWT bearer token attached by an HTTP interceptor. Routes are lazy-loaded per feature.

---

## Prerequisites

- **Java 21** (JDK)
- **MySQL** (a running instance, locally or remote)
- **Node.js** and **npm** compatible with Angular CLI 18 (Angular 18 requires Node.js 18.19+ or 20.11+)
- A Maven installation is **not** required — the backend includes the Maven Wrapper (`mvnw` / `mvnw.cmd`)

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bowed89/inventory-management-system.git
   cd inventory-management-system
   ```

2. Set up the backend configuration (see [Environment Variables](#environment-variables) below).

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

---

## Database Configuration

The backend expects a MySQL database. By default it connects to `jdbc:mysql://localhost:3306/inventory_db` (configurable via `DB_URL`, see below).

1. Create the database:
   ```sql
   CREATE DATABASE inventory_db;
   ```
2. The schema is created and updated automatically on startup by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) — no manual migration step or seed script is required to get started.

---

## Environment Variables

The backend reads its configuration from environment variables, with local overrides supported via an untracked `application-local.properties` file.

1. Copy the example file:
   ```bash
   cd backend/src/main/resources
   cp application-local.properties.example application-local.properties
   ```
2. Fill in your local values. `application-local.properties` is git-ignored and must never be committed.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_URL` | No | `jdbc:mysql://localhost:3306/inventory_db` | JDBC connection URL |
| `DB_USERNAME` | **Yes** | — | MySQL username |
| `DB_PASSWORD` | **Yes** | — | MySQL password |
| `JWT_SECRET` | **Yes** | — | Secret key used to sign JWT tokens (use a long, random value) |
| `UPLOAD_DIR` | No | `./product-image` | Local directory where uploaded product images are stored |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:4200` | Comma-separated list of origins allowed to call the API |

`DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` have no default — the application will fail to start until they are provided.

The frontend's API base URL is configured separately in `frontend/src/environments/environment.ts` (`apiUrl`, defaults to `http://localhost:8080`).

---

## Running the Backend

From the `backend/` directory:

```bash
./mvnw spring-boot:run
```

(On Windows: `mvnw.cmd spring-boot:run`)

The API starts on **http://localhost:8080** by default (no `server.port` override is configured).

---

## Running the Frontend

From the `frontend/` directory:

```bash
npm start
```

This runs `ng serve`. The application is served on **http://localhost:4200** by default.

---

## Running Tests

**Backend** (from `backend/`):
```bash
./mvnw test
```
Uses JUnit 5, Mockito, and AssertJ. Covers exception handling, transaction stock logic, image storage, CORS configuration, and controller validation.

**Frontend** (from `frontend/`):
```bash
npm test
```
Runs the Karma/Jasmine unit test suite (`ng test`) in Chrome.

---

## Main Functionality

- **Authentication**: user registration and login (`/api/auth/**`) issuing a JWT used for all subsequent requests.
- **Users**: list users, update user data, view a user's transaction history, retrieve the currently logged-in user (`/api/users/**`).
- **Categories**: full CRUD (`/api/categories/**`), restricted to `ADMIN`.
- **Suppliers**: full CRUD (`/api/suppliers/**`), restricted to `ADMIN`.
- **Products**: full CRUD with image upload (`/api/products/**`), restricted to `ADMIN`; images are served from a backend-owned static directory.
- **Transactions** (`/api/transactions/**`):
  - Purchase / restock inventory from a supplier
  - Sell products (with stock-availability validation)
  - Return products to a supplier
  - List transactions with pagination and search, filter by month/year
  - Update transaction status (`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELED`)
- **Dashboard**: charts for transaction counts by type, total amount by type, and a monthly breakdown, powered by `ngx-charts`.

---

## Project Structure

### Backend

```
backend/src/main/java/com/jesus/inventory/
├── category/     # Category entity, DTO, repository, service, controller
├── common/       # ApiResponse<T> wrapper, shared exceptions, GlobalExceptionHandler
├── config/       # ModelMapper and static resource (image serving) configuration
├── product/      # Product entity, DTO, repository, service, controller, image storage
├── security/     # JWT filter, JwtUtils, Spring Security configuration, CORS
├── supplier/     # Supplier entity, DTO, repository, service, controller
├── transaction/  # Transaction entity/DTOs, repository, service, controller, enums
└── user/         # User entity, DTOs, repository, service, auth + user controllers
```

### Frontend

```
frontend/src/app/
├── core/
│   ├── guards/          # Route guards (auth / admin-only routes)
│   ├── interceptors/    # HTTP interceptor attaching the JWT and handling 401s
│   ├── models/          # TypeScript interfaces shared across the app
│   └── services/        # ApiService, NotificationService
├── shared/
│   ├── notification/    # Global toast notification component
│   └── pagination/      # Reusable pagination component
└── features/
    ├── login/ register/
    ├── dashboard/
    ├── product/ add-edit-product/
    ├── category/
    ├── supplier/ add-edit-supplier/
    ├── purchase/ sell/
    ├── transaction/ transaction-details/
    └── profile/
```

---

## Screenshots

_Screenshots will be added here once available._

---

## Docker

Docker support is **not implemented yet**. Containerization for the backend, frontend, and MySQL will be added in a future update.

---

## CI/CD

A CI/CD pipeline is **not implemented yet**. This section will be updated once one is added.

---

## License

No license file is currently included in this repository. All rights reserved by the author unless a license is added in the future.
