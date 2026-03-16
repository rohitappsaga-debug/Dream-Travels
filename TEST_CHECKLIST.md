### Dream Travellers – Quick Regression Checklist

#### 1. Auth flows
- **Login (existing user)**
  - Visit `/login`, attempt with empty fields → see validation / error.
  - Login with wrong password → error message, no crash.
  - Login with valid user → redirect to main app (home or admin), no console errors.
- **Register new user**
  - Visit `/register`, submit invalid data → clear validation messages.
  - Register with valid data → success feedback, then login works.

#### 2. Customer package & booking flows
- **Packages list**
  - Logged-in user visits `/package` → packages load without console errors.
  - Each card shows image (if any), title, description, price, duration, route, main transport.
- **Package detail**
  - From `/package`, click “View Details” → `/package/:id` shows hero info and itinerary.
  - Click “Book This Package” → `/book` with selected package prefilled.
- **Booking**
  - On `/book`, customer name (from logged-in user) and selected package details are visible.
  - Past date cannot be selected (UI) and triggers an error if forced.
  - Submitting with missing fields shows clear error and does not call backend.
  - Submitting valid booking shows success message and redirects (e.g. to `/home`) without console errors.

#### 3. Admin dashboard & navigation
- **Admin login**
  - Login as `admin@example.com` / `admin` → redirected to `/admin`.
- **Navigation**
  - Sidebar links:
    - Dashboard → `/admin`
    - Packages → `/admin/packages`
    - Bookings → `/admin/bookings`
  - Deep linking:
    - Typing `/admin/packages` or `/admin/bookings` directly works and shows correct view.
- **Dashboard data**
  - Stats cards show non-crashing values for total packages, total bookings, revenue, upcoming travels, and by-status counts.
  - Recent bookings and Top packages sections render or show appropriate empty states.

#### 4. Admin manage packages & itineraries
- **Add package**
  - On `/admin/packages`, add a package with all fields (duration_days, nights, locations, main_transport, highlights, inclusions, exclusions, image).
  - New package appears in admin table and in customer `/package` and `/package/:id`.
- **Edit package**
  - Edit an existing package; use Cancel to discard changes; use Save to persist.
  - Changes are visible in admin list and customer views after refresh.
- **Delete package**
  - Delete a package → removed from admin list and `/package`.
  - Visiting its old `/package/:id` URL shows “Package not found” (no crash).
- **Itinerary editor**
  - Load itinerary for a package, add/edit/remove days, save.
  - Verify `/package/:id` itinerary matches admin edits after reload.

#### 5. Admin manage bookings & status
- **Bookings table**
  - On `/admin/bookings`, table loads with bookings or shows a clear “No bookings found” message.
- **Filters**
  - Search by customer/package name filters rows correctly.
  - Status dropdown filters by confirmed/cancelled/completed/pending; combined with search works as expected.
- **Status updates & dashboard**
  - Change status for at least one booking; refresh and confirm status persists.
  - Check `/admin` dashboard “By Status”, total bookings, and revenue reflect updates after refresh.

#### 6. Error resilience sanity checks
- **Backend error / invalid JSON**
  - Temporarily simulate a backend error (e.g., stop PHP or break one endpoint) and:
    - Visit `/package` → user sees a friendly error, app doesn’t crash.
    - Attempt a booking → user sees a “server error” style message, not a blank screen or stack trace.
- **Twilio / Mailhog failures**
  - If SMS/email services are misconfigured, booking still succeeds and shows a normal success path (no JS crash).

#### 7. Admin manage buses & routes
- **Manage Routes**
  - Visit `/admin/routes`, add a new route (Source, Destination, Optional Name).
  - Verify route appears in the table.
  - Edit a route and verify changes persist.
  - Delete a route and verify it's removed.
- **Manage Buses**
  - Visit `/admin/buses`, register a new bus and assign it to a route.
  - Verify bus appears in the "Live Bus Fleet" table.
  - Click "Layout" on a bus to open the seat configurator.
  - Delete a bus and verify it and its layout are removed.
