# 🚀 Deploying Addvance to Vercel

## Prerequisites
- ✅ GitHub repository: `ShyaamN/Addvance` (already set up)
- ✅ Built application ready to deploy
- ✅ Vercel configuration created

---

## Step-by-Step Deployment Guide

### 1️⃣ **Sign Up for Vercel** (if you haven't)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

---

### 2️⃣ **Import Your Project**

1. Once logged in, click **"Add New..."** → **"Project"**
2. Find your repository: `ShyaamN/Addvance`
3. Click **"Import"**

---

### 3️⃣ **Configure Build Settings**

Vercel should auto-detect settings, but verify these:

**Framework Preset:** Other (or Vite)

**Build & Development Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`

**Root Directory:** `./` (leave as is)

---

### 4️⃣ **Environment Variables** (Optional for now)

You can skip this for now since your app uses local storage.

Later, if you add a database:
- `DATABASE_URL` - Your database connection string
- `NODE_ENV` - `production`

---

### 5️⃣ **Deploy!**

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build
3. ✅ Your app will be live at: `https://addvance.vercel.app` (or similar)

---

## 📊 **What Happens During Deployment:**

```
1. Vercel clones your GitHub repo
2. Runs npm install
3. Runs npm run build (Vite builds your React app)
4. Deploys static files to CDN
5. Your app is live! 🎉
```

---

## 🔄 **Automatic Deployments**

**Every time you push to GitHub:**
- ✅ Vercel automatically rebuilds
- ✅ Deploys the new version
- ✅ Gives you a unique preview URL

**Branches:**
- `main` branch → Production site
- Other branches → Preview deployments

---

## 🌐 **Custom Domain (Optional)**

1. In Vercel dashboard → Your project → **Settings** → **Domains**
2. Add your domain (if you have one)
3. Update DNS records as instructed
4. Or use the free `.vercel.app` subdomain

---

## ⚠️ **Current Limitations (No Database Yet)**

Since your app currently uses **local storage** for data:

✅ **Works perfectly:**
- Taking quizzes
- Viewing statistics
- Practice mode
- Dark mode
- All frontend features

❌ **Won't persist across devices:**
- Admin questions (local state only)
- User progress (localStorage)
- CSV uploads (temporary)

---

## 🎯 **Next Steps (Optional - Add Database)**

To make data persist, you can add **Supabase** (free PostgreSQL):

### Quick Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (FREE tier)
3. Copy the connection string
4. Add it to Vercel environment variables
5. Your questions will persist!

Would you like me to help set up the database integration?

---

## 🐛 **Troubleshooting**

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Verify TypeScript compiles: `npm run check`

**App loads but blank screen?**
- Check browser console for errors
- Verify routing in vercel.json

**API routes not working?**
- Currently using mock data (expected)
- Database needed for persistence

---

## 📝 **Important Files for Deployment**

- ✅ `vercel.json` - Configuration (created)
- ✅ `package.json` - Dependencies
- ✅ `vite.config.ts` - Build settings
- ✅ `tsconfig.json` - TypeScript config

---

## 🎓 **Your Deployment URL**

After deployment, your app will be at:
```
https://addvance-[random].vercel.app
```

You can rename it in Vercel settings to:
```
https://addvance-maths.vercel.app
```

---

## 🎉 **Ready to Deploy?**

1. Commit the new `vercel.json` file:
   ```bash
   git add vercel.json
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your project
4. Click Deploy!

**That's it!** Your quiz app will be live in ~2 minutes! 🚀

---

Need help with any step? Just ask!
