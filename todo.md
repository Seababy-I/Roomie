# Roomie Project Todo List

This todo list is broken down into steps based on the PRD, Design Document, and Technical Document.

## 🏗️ 1. Foundation & Environment Setup (Tech Stack)
- [x] Initialize Backend Project (Node.js, Express)
- [x] Initialize Frontend Project (React, Tailwind CSS, Vite)
- [x] Configure MongoDB Atlas and Mongoose connection
- [x] Setup Environment Variables (.env)
  - [x] Backend: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - [x] Frontend: `VITE_API_URL`
- [x] Setup Project Structure as per Tech Doc (folders for controllers, routes, models, etc.)



## 🔒 2. Authentication System (Email OTP)
- [x] Implement OTP-Based Login Flow (Send & Verify)
- [x] Add domain validation (strict restriction to `@learner.manipal.edu`)
- [x] Create User & OTP Schemas
- [x] Implement JWT/Session handling
- [x] Endpoint: `POST /auth/send-otp`
- [x] Endpoint: `POST /auth/verify-otp`
- [x] Endpoint: `GET /users/me`



## 🏠 3. Listing Management (PRD, Design & Tech Stack)
- [x] Create Listing Schema
  - [x] Fields: title, rent, location, flatType, genderPreference, moveInDate, amenities (tags), description, images, compatibilityTags
- [x] Backend API:
  - [x] `POST /listings` (Create listing with validation)
  - [x] `GET /listings` (Paginated feed, sorted by latest)
  - [x] `GET /listings/:id` (Detail view)
  - [x] `DELETE /listings/:id` (Delete listing)
- [ ] Frontend Features:
  - [x] Post Listing Form (Design: Form-based input)
  - [x] Browse Feed (Design: Card-based layout, Rounded corners)
  - [x] Filter System (Rent range, location, gender, flat type)
  - [x] Listing Detail Page (Images, rent/location, amenities tags, Interest button)




## ❤️ 4. Interest System & Contact Sharing (PRD & Tech Stack)
- [x] Create Interest Schema (listingId, userId, status: pending/accepted/rejected)
- [x] Backend API:
  - [x] `POST /interests/:listingId` (Express interest)
  - [x] `GET /interests/:listingId` (View interested users for a listing)
  - [x] `PATCH /interests/:id` (Update status: Accept/Reject)
- [x] Logic: Reveal phone number only after interest is accepted.


## 👤 5. Profile & User Experience (PRD & Design Doc)
- [x] Frontend Profile Page:
  - [x] Display User info
  - [x] Section: My Listings (Listings posted by user)
  - [x] Section: Interests Sent/Received
- [x] Implement Dark Theme as per Design Doc
  - [x] Background: `#0F0F0F`
  - [x] Card: `#1A1A1A`
  - [x] Accent: `#6366F1`
  - [x] Text: `#FFFFFF` / `#A1A1AA`
- [x] Responsive Design (Mobile-first)


## 🛡️ 6. Security & Optimization (Tech Stack)
- [x] Implement Rate Limiting and Helmet for security
- [x] Add Request Validation (Joi or Zod)
- [x] Implement Error Handler Middleware
- [x] Frontend Optimizations:
  - [x] Lazy loading images
  - [x] Debounced search/filtering
- [x] API Response time optimization (< 500ms)


## 🚀 7. Deployment (Tech Stack)
- [x] Create Deployment Guide (Vercel, Render, Atlas)
- [ ] Deploy Backend to Render/Railway
- [ ] Deploy Frontend to Vercel/Netlify
- [ ] Final Verification & Testing


---
## ✨ Future Enhancements (V2)
- [ ] Notifications System (WebSockets)
- [ ] In-app Chat
- [ ] AI-based matching
- [ ] Map View integration (Google Maps/Leaflet)
