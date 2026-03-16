## Dream Travellers – Setup Guide

This project is a simple full‑stack app:
- **Frontend**: React (Create React App) in `frontend/`
- **Backend**: PHP + MySQL in `backend/`

### 1. Prerequisites

- Node.js 18+ and npm
- PHP 8+ (with `mysqli` extension)
- MySQL (or MariaDB)
- Optional but recommended:
  - **Mailhog** (SMTP test server) for booking emails
  - **Twilio** account for booking SMS (optional; bookings still work without it)

### 2. Database setup

1. Start MySQL.
2. From the backend folder, run the init SQL to create/update the schema:

   ```bash
   cd backend
   mysql -u root < db/init.sql
   ```

   This creates the `dream_travellers` database (if missing) and all required tables (`users_data`, `packages_data`, `bookings_data`, `services_data`).

3. (Optional) Seed with dummy data:

   ```bash
   php seed.php
   ```

   This adds:
   - Sample users (`user1@test.com`, `user2@test.com`, password `password123`)
   - Sample packages, services and bookings.

4. (Optional) Create an admin user:

   ```bash
   php create_admin.php "Admin" "admin@example.com" "admin123"
   ```

   You can then log in as `admin@example.com` / `admin123` and access the admin panel.

5. (Optional) Export or restore a full DB dump:

   - Export (already done once for you):
     ```bash
     cd backend/db
     mysqldump -u root dream_travellers > dream_travellers_dump.sql
     ```
   - Restore:
     ```bash
     mysql -u root dream_travellers < dream_travellers_dump.sql
     ```

> **Note:** By default the backend uses MySQL `root` with no password on `127.0.0.1:3306`. Adjust `backend/config.php` if your local setup differs.

### 3. Backend (PHP) server

From the backend folder:

```bash
cd backend
php -S localhost:8000
```

The PHP endpoints (e.g. `login.php`, `register.php`, `get_packages.php`, `book_package.php`) are then available at `http://localhost:8000/...`.

#### 3.1. Mailhog (email testing, optional)

If you want to receive booking confirmation emails:

1. Start Mailhog (example):

   ```bash
   mailhog
   ```

   It typically listens on:
   - SMTP: `127.0.0.1:1025`
   - UI: `http://localhost:8025`

2. Optionally set environment variables before starting PHP:

   ```bash
   export MAILHOG_HOST=127.0.0.1
   export MAILHOG_PORT=1025
   export MAIL_FROM=noreply@dreamtravellers.local
   php -S localhost:8000
   ```

3. After a successful booking, check `http://localhost:8025` to see the confirmation email.

#### 3.2. Twilio SMS (optional)

To send SMS confirmations after booking:

1. Set these environment variables before running the PHP server:

   ```bash
   export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   export TWILIO_AUTH_TOKEN=your_auth_token
   export TWILIO_FROM_NUMBER=+1234567890
   php -S localhost:8000
   ```

2. Use a valid E.164 phone number (e.g. `+919876543210`) in the booking form.  
   If Twilio variables are not set, the booking still completes, but SMS is skipped.

### 4. Frontend (React) app

From the `frontend` folder:

```bash
cd frontend
npm install
npm start
```

- The app runs at `http://localhost:3000`.
- It expects the backend at `http://localhost:8000` by default.

#### 4.1. API base URL config

The frontend uses a small config file to control the backend base URL:

```js
// frontend/src/config.js
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
```

To point the frontend to a different backend, set:

```bash
export REACT_APP_API_BASE_URL="https://your-backend-host"
npm start
```

### 5. Typical dev workflow

1. Start MySQL (and Mailhog/Twilio env vars if you need email/SMS).
2. Start both Frontend and Backend with a single command:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in the browser:
   - Register / log in (or use the seeded users).
   - Browse packages and book trips.
   - **Bus & Route Management**: Use `/admin/routes` and `/admin/buses` to manage the fleet.
   - Use `/admin` as an admin user to manage packages and view bookings.
