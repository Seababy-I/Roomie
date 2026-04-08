# 🚀 Roomie Deployment Guide

Follow these steps to deploy the Roomie platform to production.

## 1. Prerequisites
- [ ] A GitHub repository with your project pushed to it.
- [ ] A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster.
- [ ] A [Google Cloud Console](https://console.cloud.google.com/) project for OAuth.

---

## 2. Backend Deployment (Render)
We recommend **Render** for hosting the Node.js backend.

1.  **Create a New Web Service**:
    *   Connect your GitHub repository.
    *   Select the `backend` directory as the **Root Directory**.
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
2.  **Add Environment Variables**:
    *   `PORT`: `5000` (Render will override this, but good to have)
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A long random string (e.g., `s0m3_v3ry_s3cr3t_key`).
    *   `GOOGLE_CLIENT_ID`: From Google Cloud Console.
    *   `FRONTEND_URL`: Your Vercel URL (e.g., `https://roomie-frontend.vercel.app`) - *Update this AFTER frontend deployment.*
3.  **Note the URL**: Once deployed, Render will give you a URL like `https://roomie-backend.onrender.com`.

---

## 3. Frontend Deployment (Vercel)
We recommend **Vercel** for the React/Vite frontend.

1.  **Create a New Project**:
    *   Connect your GitHub repository.
    *   Select the `frontend` directory as the **Root Directory**.
    *   **Framework Preset**: Vite.
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
2.  **Add Environment Variables**:
    *   `VITE_API_URL`: Your Render Backend URL (e.g., `https://roomie-backend.onrender.com/api`).
    *   `VITE_GOOGLE_CLIENT_ID`: Same as backend.
3.  **Deployment**: Click **Deploy**. Vercel will give you a production URL.

---

## 4. Final Configurations (CRITICAL)

### ✅ Update Google OAuth Redirect URIs
1.  Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2.  Edit your **OAuth 2.0 Client ID**.
3.  Add your production Frontend URL to **Authorized JavaScript origins**:
    *   `https://roomie-frontend.vercel.app`
4.  Add your production URL to **Authorized redirect URIs** (if using server-side redirects):
    *   `https://roomie-frontend.vercel.app`

### ✅ Update Backend CORS
Ensure the `FRONTEND_URL` environment variable on Render matches your final Vercel URL. I've already updated the code to support this variable.

### ✅ MongoDB Atlas White-listing
1.  In MongoDB Atlas, go to **Network Access**.
2.  Add `0.0.0.0/0` (Allow access from anywhere) to ensure Render can connect. Alternatively, find Render's outgoing IP addresses.

---

## 🎉 Success!
Your application is now live. Test the login flow and listing creation to ensure everything is connected.
