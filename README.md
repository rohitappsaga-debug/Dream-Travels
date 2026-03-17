## Dream Travellers – Setup Guide

This project is a full‑stack app:
- **Frontend**: React (Create React App) in `frontend/`
- **Backend**: PHP + MySQL in `backend/`

---

### 🚀 Quick Start

1.  **Install dependencies** in the root directory:
    ```bash
    npm install
    ```
2.  **Setup the database** (Structure + Seed data):
    ```bash
    npm run db:setup
    ```
3.  **Start both Frontend and Backend**:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 1. Prerequisites

- **Node.js 18+** & **PHP 8+** (with `mysqli`)
- **MySQL** running on `127.0.0.1:3306` (user: `root`, no password)

### 2. Database & Admin Setup

If you need to seed data or create an admin user:

- **Seed dummy data**: `npm run db:seed`
- **Create Admin**: `npm run db:admin "Admin" "admin@example.com" "admin123"`

### 3. Manual Startup (Optional)

If you prefer running services separately:
- **Backend**: `cd backend && php -S localhost:8000`
- **Frontend**: `cd frontend && npm start`

---

### 4. Configuration & Features

#### 4.1. Mailhog (Email testing)
1. Start Mailhog (`mailhog`). SMTP: `1025`, UI: `http://localhost:8025`.
2. Check `http://localhost:8025` after bookings to see confirmation emails.

#### 4.2. Twilio SMS (Optional)
Set environment variables (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`) before starting the PHP server to enable SMS notifications.

#### 4.3. API Configuration
The frontend expects the backend at `http://localhost:8000`. This is configured in `frontend/src/config.js`.

---

### 5. Dev Workflow

- **Admin Panel**: Log in and go to `/admin` to manage packages.
- **Bus & Route Management**: Use `/admin/routes` and `/admin/buses`.
- **User Flow**: Browse packages, select services, and complete bookings.
