# 💈 KING BARBAR SHOP - Luxury Men's Salon & Booking Platform

A full-stack, enterprise-grade salon and barber appointment booking platform crafted with modern web technologies, strict authentication-gated scheduling, comprehensive admin operations, and a luxury **Orange & White** UI aesthetic.

---

## ✨ Features

- **🛡️ Strict Login-Required Booking Gate**: Guests browsing services are seamlessly prompted with a Material UI modal to log in or register before scheduling chairs.
- **📅 Interactive Real-time Scheduling**:
  - Multi-step booking wizard with service selection, date picker pills, live time slot availability, and instant confirmation.
  - Automatic pre-fill of authenticated customer profile (Name, Email, Phone).
- **👑 Role-Based Access Control**:
  - **Guests**: Browse catalog, hairstyle lookbook, salon info, with auth-gated booking buttons.
  - **Customers**: Manage appointments, cancel upcoming bookings, review history under *My Bookings*, manage profile.
  - **Admins**: Complete control panel to manage all client appointments, service catalog pricing, time slots/hours, and customer directory.
- **🔐 Secure Backend Architecture**:
  - RESTful Express API with JWT authentication and bcrypt password hashing.
  - PostgreSQL database powered by Prisma ORM with automated migrations & seeding.
  - Route protection & validation on both frontend and backend endpoints.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI & Styling**: Material UI (MUI v5) + Custom Design System
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT interceptors
- **Visuals & Feedback**: Canvas Confetti, Material Icons, Google Fonts (Outfit & Plus Jakarta Sans)

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma Client
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Logging & Utilities**: Morgan, CORS, Dotenv

---

## 📁 Project Structure

```text
.
├── backend/
│   ├── controllers/       # Controller handlers (auth, booking, services, etc.)
│   ├── middleware/        # JWT auth & admin role verification middleware
│   ├── prisma/            # Prisma schema & database seeder
│   ├── routes/            # Express API route declarations
│   ├── utils/             # JWT & helper utilities
│   ├── db-setup.js        # Automatic embedded PostgreSQL & DB initializer
│   ├── server.js          # Express app entry point
│   ├── .env.example       # Example backend configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, Footer, ProtectedRoute, LoginRequiredDialog)
│   │   ├── context/       # React Context providers (AuthContext, NotificationContext)
│   │   ├── layouts/       # Admin console layout
│   │   ├── pages/         # Customer pages (Home, Services, Hairstyles, Booking, Login, Register, MyBookings)
│   │   │   └── admin/     # Admin management pages (Dashboard, Bookings, Services, TimeSlots, Customers)
│   │   ├── services/      # Axios API client & interceptors
│   │   ├── theme.js       # Luxury Orange + White MUI theme definition
│   │   ├── App.jsx        # Routing configuration
│   │   └── main.jsx       # React DOM root
│   ├── index.html
│   ├── .env.example       # Example frontend configuration
│   └── package.json
│
├── .gitignore             # Git ignore rules for node_modules, .env, build output
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- PostgreSQL database (or local database instance)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `DATABASE_URL` with your PostgreSQL connection string and set `JWT_SECRET`.

4. Run Prisma database migrations and seed data:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will start at `http://localhost:5000` (API endpoint: `http://localhost:5000/api`).*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (optional, defaults to `http://localhost:5000/api`):
     ```bash
     cp .env.example .env
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `ajairaja2004@gmail.com` | `Admin@123456` |
| **Customer** | `vikram@example.com` | `User@123456` |

---

## 📄 License

This project is proprietary and maintained for **KING BARBAR SHOP**. All rights reserved.
