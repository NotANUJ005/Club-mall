# Club Mall - Full Stack MERN Application

A premium shopping club experience built with React, Node.js, and MongoDB.

## 🚀 Deployment

This project is structured for seamless deployment on **Vercel** (Frontend) and **Render** (Backend).

### 🌐 Frontend (Vercel)
- **Deployment Root**: Project Root `/`
- **Framework Preset**: Vite
- **Build Command**: `npm run build --prefix client`
- **Output Directory**: `client/dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your backend URL (e.g., `https://club-mall.onrender.com/api`)

### ⚙️ Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secure random string for tokens.
  - `ALLOWED_ORIGINS`: `https://club-mall.vercel.app` (your frontend URL)
  - `NODE_ENV`: `production`

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   npm install --prefix client
   npm install --prefix server
   ```

2. Run both client and server:
   ```bash
   npm run dev
   ```

3. Seed the database (optional):
   ```bash
   npm run seed
   ```
