# Tour Server

REST API for a Bangladesh tour booking platform. Handles auth, tours, bookings, SSLCommerz payments, comments, and media upload.

## Features

- **Auth** — email/password login, JWT access + refresh cookies, Google OAuth, logout
- **Password** — change, set (for Google users), forget, and reset
- **OTP** — send and verify OTP for email confirmation
- **Users** — register, profile (`/me`), role-based updates, admin user list
- **Roles** — `USER`, `ADMIN`, `SUPER_ADMIN` with route-level access control
- **Divisions** — CRUD for Bangladesh divisions used to group tours
- **Tour types** — CRUD for categories (Adventure, Beach, Heritage, etc.)
- **Tours** — create, list with filters, update, delete; unique tour titles
- **Bookings** — create booking, track status (Pending / Confirmed / Failed / Cancelled)
- **Payments** — SSLCommerz sandbox checkout with success, fail, cancel, and IPN callbacks
- **Comments** — authenticated reviews with 1–5 star ratings; public list by tour
- **Stats** — dashboard analytics for admin
- **Uploads** — Multer + Cloudinary for tour and division images
- **Validation** — Zod request validation and centralized error handling

## Payment flow

**Success**

1. User picks a tour and creates a booking (`PENDING`) with payment `UNPAID`
2. Backend opens SSLCommerz checkout
3. User pays on the SSLCommerz page
4. SSLCommerz hits `POST /api/v1/payment/success`
5. Payment becomes `PAID`, booking becomes `CONFIRM`
6. User is redirected to the frontend success page

**Fail / Cancel**

1. Same booking + unpaid payment, then SSLCommerz checkout
2. User fails or cancels payment
3. Backend marks payment `FAIL` or `CANCEL` and booking `FAIL` or `CANCEL`
4. User is redirected to the frontend fail or cancel page

## Image upload (Multer + Cloudinary)

1. Client sends the image as `multipart/form-data`
2. Multer receives the file and uploads it straight to Cloudinary
3. Cloudinary returns a URL, stored on `req.file` / `req.files`
4. That URL is saved in MongoDB with the tour or division
5. To delete later, `public_id` is taken from the URL and the file is removed from Cloudinary
