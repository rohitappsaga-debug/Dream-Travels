# Status Column – Plan and Flow (Whole App)

This plan keeps the **Status** column in Admin bookings and manages it across the app: database, backend, and frontend.

---

## 1. Status values

Use a small set of values so the UI and API stay consistent:

| Value       | Meaning                          |
|------------|-----------------------------------|
| `confirmed` | Booking created and confirmed     |
| `cancelled`| Booking cancelled by admin/user  |
| `completed`| Trip completed                    |
| `pending`  | Optional: awaiting payment/action |

Default for new bookings: **`confirmed`**.

---

## 2. Database

### 2.1 Add column

**File:** `dream_travellers_backend/db/add_booking_status.sql` (new migration)

```sql
ALTER TABLE bookings_data
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
AFTER package_price;
```

Run once on existing DB (e.g. `mysql -u root dream_travellers < add_booking_status.sql` or run the SQL in your client).

### 2.2 New installs / init

If you have an `init.sql` or schema used for fresh installs, add to `bookings_data`:

```sql
status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
```

Update `dream_travellers_dump.sql` when you regenerate dumps so new restores include `status`.

---

## 3. Backend

### 3.1 Create booking – set initial status

**File:** `dream_travellers_backend/book_package.php`

- In the `INSERT` into `bookings_data`, add column `status` and value `'confirmed'`.
- Example:  
  `INSERT INTO bookings_data (..., package_price, status) VALUES (..., ?, 'confirmed')`  
  and add one more `?` in `bind_param` for `package_price` only (status is literal).

So: extend the existing INSERT to include `status` with value `'confirmed'` for every new booking.

### 3.2 Get bookings – already returns status

**File:** `dream_travellers_backend/get_bookings.php`

- Uses `SELECT * FROM bookings_data`, so once the `status` column exists, it is returned. No code change needed.

### 3.3 Update booking status (admin)

**File:** `dream_travellers_backend/update_booking_status.php` (new)

- Accept POST JSON: `{ "id": <booking_id>, "status": "<status>" }`.
- Validate `status` against allowed values: `confirmed`, `cancelled`, `completed`, `pending`.
- Use a prepared statement:  
  `UPDATE bookings_data SET status = ? WHERE id = ?`
- Return JSON: `{ "success": true, "message": "..." }` or error.
- Include CORS and `require config.php` like other API files.

This allows the admin UI to change status and keeps status “managed” in one place (backend).

---

## 4. Frontend

### 4.1 Admin – Manage Bookings table (main Admin panel)

**File:** `frontend/src/Admin/Admin.jsx`

- In the Manage Bookings table:
  - Add **header:** `<th>Status</th>`.
  - Add **cell:** `<td>{b.status ?? 'confirmed'}</td>` (or show a badge/label).
- Set “No bookings found” row to `colSpan="7"` (to account for the extra column).
- Optional: add a control to change status (e.g. dropdown or buttons) that calls `update_booking_status.php` and then refetches bookings.

### 4.2 Admin – AdminBookings page (if used)

**File:** `frontend/src/Admin/AdminBookings.jsx`

- Add **header:** `<th>Status</th>`.
- Add **cell:** `<td>{b.status ?? 'confirmed'}</td>`.
- Set “No bookings found” row to `colSpan="7"`.

So the Status column is visible and consistent in both admin views.

### 4.3 User-facing booking (optional)

**File:** `frontend/src/componet/Book.js`

- After a successful booking, the success message can say something like “Booking confirmed” (which matches `status = 'confirmed'`). No schema change in the UI, just wording.

If you later add a “My Bookings” page, show `booking.status` there (e.g. confirmed / cancelled / completed).

---

## 5. Seed data

**File:** `dream_travellers_backend/seed.php`

- After adding the `status` column to the table, extend the INSERT to include `status` (e.g. `'confirmed'` for all seed rows).
- Adjust column list and `bind_param` so they match the new schema (including `status`).

---

## 6. Implementation order

1. **DB:** Add `status` column (migration + optional init/dump update).
2. **Backend:**  
   - `book_package.php`: set `status = 'confirmed'` on INSERT.  
   - Add `update_booking_status.php` for admin updates.
3. **Seed:** Update `seed.php` to insert `status` (e.g. all `'confirmed'`).
4. **Frontend:**  
   - `Admin.jsx`: add Status column (and optional status change control).  
   - `AdminBookings.jsx`: add Status column.  
   - Optionally adjust success copy in `Book.js` and any “My Bookings” view later.

---

## 7. Summary

- **Database:** `bookings_data.status` added and defaulted to `'confirmed'`.
- **Backend:** New bookings get `confirmed`; `get_bookings` returns status; `update_booking_status.php` allows admin to change it.
- **Frontend:** Admin and AdminBookings tables show Status; admin can optionally update it via the new API.

This keeps Step 11’s intent (status managed in the app) while retaining the Status column and a clear flow from booking creation → display → admin updates.
