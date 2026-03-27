## Dream Travellers – Setup Guide

This project is a full‑stack app:
- **Frontend**: React (Create React App) in `frontend/`
- **Backend**: PHP + MySQL in `backend/`

---

### 🚀 Quick Start (Fresh Setup)

From the root directory, run these commands in order:

1.  **Install All Dependencies**:
    ```bash
    npm install
    ```
    *(Installs both root and frontend dependencies automatically)*

2.  **Initialize Database & Seed Data**:
    ```bash
    npm run db:setup
    ```
    *(Creates tables and inserts test packages, users, and bookings. Requires MySQL running)*

3.  **Start the Application**:
    ```bash
    npm run dev
    ```
    *(Starts PHP backend on port 8000 and React frontend on port 3000)*

4.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 📚 Extra Libraries & Dependencies

This project uses several additional libraries to enhance functionality.

#### 🖥️ Frontend (React)
Installed in the `frontend/` directory:
- **`axios`**: For making API requests to the backend.
- **`react-router-dom`**: For client-side routing and navigation.
- **`lucide-react`**: For high-quality UI icons.
- **`tailwindcss`**: For modern utility-first CSS styling.
- **`jspdf` & `html2canvas`**: For generating PDF booking confirmations.

**Command to install**:
```bash
cd frontend && npm install axios react-router-dom lucide-react tailwindcss jspdf html2canvas
```

#### ⚙️ Backend & Infrastructure (PHP/Tools)
The backend uses standard PHP extensions (`mysqli`, `curl`) and does NOT require external PHP SDKs. It interacts with the following via direct API calls:
- **Mailhog**: Local SMTP server for email testing.
- **Razorpay**: Payment gateway integration.
- **Twilio**: SMS notification integration.

#### 🏗️ Development Tools
Installed in the root directory:
- **`concurrently`**: To run the backend and frontend servers simultaneously.

**Command to install**:
```bash
npm install -D concurrently
```

---

### 1. Prerequisites

- **Node.js 18+** & **PHP 8+** (with `mysqli`)
- **MySQL** running on `127.0.0.1:3306` (user: `root`, no password)

### 2. Database & Admin Setup

If you need to seed data or create an admin user:

- **Seed dummy data**: `npm run db:seed`
- **Create Admin**: `npm run db:admin "Admin" "admin@example.com" "admin123"`

### 3. 🔐 Test Credentials

After running the seeder (`npm run db:setup`), you can use the following accounts for testing:

#### 🛂 Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin`
- **Role**: Admin (Access to `/admin` dashboard)

#### 👤 Test User Credentials
- **Email**: `user1@test.com` / **Password**: `password123`
- **Email**: `user2@test.com` / **Password**: `password123`
- **Role**: User

---

### 4. Manual Startup (Optional)

If you prefer running services separately:
- **Backend**: `cd backend && php -S localhost:8000`
- **Frontend**: `cd frontend && npm start`

---

### 5. Configuration & Features

#### 5.1. Mailhog (Email testing)
1. Start Mailhog (`mailhog`). SMTP: `1025`, UI: `http://localhost:8025`.
2. Check `http://localhost:8025` after bookings to see confirmation emails.

#### 5.2. Twilio SMS (Optional)
Set environment variables (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`) before starting the PHP server to enable SMS notifications.

#### 5.3. API Configuration
The frontend expects the backend at `http://localhost:8000`. This is configured in `frontend/src/config.js`.

---

### 6. Dev Workflow

- **Admin Panel**: Log in and go to `/admin` to manage packages.
- **Bus & Route Management**: Use `/admin/routes` and `/admin/buses`.
- **User Flow**: Browse packages, select services, and complete bookings.
