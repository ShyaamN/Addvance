# 🚀 Deploying Addvance to Render

## Prerequisites
- ✅ GitHub repository: `ShyaamN/Addvance` (already pushed)
- ✅ Built application ready to deploy
- ✅ Render configuration created (`render.yaml`)

---

## Step-by-Step Deployment Guide

### 1️⃣ **Sign Up for Render**

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub

---

### 2️⃣ **Create New Web Service**

1. After logging in, click the **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub account if prompted
4. Find and select your repository: **`ShyaamN/Addvance`**
5. Click **"Connect"**

---

### 3️⃣ **Configure Your Service**

Render will show a configuration form. Fill in:

| Setting | Value |
|---------|-------|
| **Name** | `addvance-math-quizzer` (or your choice) |
| **Environment** | `Node` |
| **Region** | Choose closest to you (e.g., Singapore, Oregon) |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

✅ These settings match your `render.yaml` configuration

---

### 4️⃣ **Set Environment Variables**

**IMPORTANT:** You must add your MongoDB connection string:

1. After creating the service, go to the **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add the following:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://addvancemathsdev_db_user:6FfbJfZIZnl5ElL6@cluster0.yjnohgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` |

4. Click **"Save Changes"**

> ⚠️ Without this environment variable, your app won't be able to connect to MongoDB Atlas and will crash on startup.

---

### 5️⃣ **Deploy**

1. Click **"Create Web Service"**
2. Render will start building your app (watch the logs!)
3. Wait **3-5 minutes** for deployment
4. Your app will be live at: `https://addvance-math-quizzer.onrender.com`

---

## 🎉 Your App is Live!

Once deployed, you'll see:
- ✅ Live URL
- ✅ Deploy logs
- ✅ Service status

---

## ⚡ Automatic Deployments

Every push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update features"
git push origin main
# Render automatically deploys the changes!
```

---

## ⚠️ Important: Free Tier Behavior

**Free services spin down after 15 minutes of inactivity**

- ⏰ First request after sleep: ~30-60 seconds (cold start)
- ⚡ Subsequent requests: Fast as normal
- 💡 Good for: Development, testing, low-traffic apps
- 💰 Keep always active: Upgrade to $7/month paid plan

**MongoDB Atlas Free Tier**

- 512MB storage (sufficient for thousands of questions)
- Shared resources (adequate for educational use)
- Always available (doesn't sleep)
- No credit card required

---

## 🐛 Troubleshooting

### Build Fails ❌

**Check:**
- ✅ Run `npm run build` locally first
- ✅ Check build logs in Render dashboard
- ✅ Verify all dependencies in `package.json`

**Common Fix:**
```bash
# Test build locally
npm install
npm run build
# If successful locally, push to GitHub
git push origin main
```

---

### App Won't Load 🔄

**Possible Causes:**
1. **Service is sleeping** (cold start takes 30-60 seconds on free tier)
2. **Build errors** - Check logs
3. **Port issues** - Render uses `PORT` environment variable automatically

**Check:**
- Service status shows "Live" (not "Suspended")
- View logs: Dashboard → Logs tab
- Browser console for frontend errors

---

### Need Database? 💾

Currently using localStorage (browser-only, not persistent).

**Option 1: Render PostgreSQL (Free 90 days)**
1. Dashboard → New + → PostgreSQL
2. Copy connection URL
3. Add as `DATABASE_URL` environment variable

**Option 2: Supabase (Free Forever)**
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add as `DATABASE_URL` in Render

---

## 📊 Monitoring Your App

### View Logs
- Dashboard → Your Service → **Logs** tab
- Real-time log streaming
- Filter by time range

### Check Metrics
- Dashboard → Your Service → **Metrics** tab
- CPU usage
- Memory usage
- Request counts

### Deployment History
- Dashboard → Your Service → **Events** tab
- See all deployments
- Rollback to previous versions if needed

---

## 💎 Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Services | 750 hours/month (1 app 24/7) |
| RAM | 512MB |
| CPU | Shared |
| Bandwidth | 100GB/month |
| Build Time | 500 min/month |
| HTTPS | ✅ Automatic |
| Custom Domains | ✅ Yes |
| Sleeps After | 15 min inactivity |

✅ Your Math Quizzer fits perfectly!

---

## 🎓 Custom Domain Setup (Optional)

1. Go to **Settings** → **Custom Domain**
2. Enter your domain (e.g., `mathquiz.com`)
3. Add these DNS records at your domain provider:

**For apex domain (mathquiz.com):**
```
Type: A
Name: @
Value: [Render provides IP]
```

**For subdomain (www.mathquiz.com):**
```
Type: CNAME
Name: www
Value: addvance-math-quizzer.onrender.com
```

4. Wait for DNS propagation (5-60 minutes)
5. ✅ Your custom domain is live with free SSL!

---

## 🔄 How to Update Your App

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Runs build
# 3. Deploys new version
# 4. Zero downtime!
```

---

## 💰 When to Upgrade to Paid?

Consider upgrading ($7/month) if you need:
- ✅ No sleep/cold starts (always active)
- ✅ More RAM (up to 16GB)
- ✅ Dedicated CPU
- ✅ Priority builds
- ✅ Higher bandwidth

For classroom use with free tier:
- First student may wait 30-60 sec
- Rest will have fast experience
- Totally acceptable for education!

---

## 🎯 Next Steps After Deployment

1. **Test your live app** - Try all features
2. **Share the URL** with students/teachers
3. **Monitor usage** - Check dashboard regularly
4. **Add database** (optional) - For persistent data
5. **Custom domain** (optional) - Professional look

---

## 📞 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Check Logs**: First place to look for errors!

---

**Congratulations! Your Math Quizzer is live! 🎉**
