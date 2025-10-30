# 🚀 PRODUCTION DEPLOYMENT GUIDE - dropzone-africa.com

## 🎯 Current Status
- ✅ Domain: dropzone-africa.com (registered with Cloudflare)
- ✅ Frontend: Ready for Vercel deployment 
- ✅ Database: Supabase tables created
- ✅ Backend: Production-ready with security features

## 📋 DEPLOYMENT STEPS

### 1. 🗃️ **Backend Deployment (Choose One)**

#### Option A: Railway (Recommended - Easy)
1. Go to [railway.app](https://railway.app) and sign up
2. Click "Deploy from GitHub repo"
3. Connect your GitHub and select your repository
4. Choose the `backend` folder as root
5. Add environment variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=generate-a-64-character-random-string
   PORT=8080
   ```
6. Railway will provide a URL like: `https://your-app.railway.app`

#### Option B: Render
1. Go to [render.com](https://render.com) and sign up
2. Create "New Web Service" 
3. Connect GitHub repository
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start:prod`
6. Add same environment variables as Railway

### 2. 🌐 **Configure Your Domain**

#### Update Backend URL
Once your backend is deployed, you'll get a URL like:
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`

Update your frontend API configuration:

```javascript
// In services/apiService.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://YOUR-BACKEND-URL.railway.app/api'  // Replace with your actual backend URL
  : 'http://localhost:8080/api';
```

### 3. 🎨 **Frontend Deployment (Vercel)**

Since you already have Vercel connected:

1. **Update Environment Variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     ```
     NODE_ENV=production
     VITE_API_BASE_URL=https://YOUR-BACKEND-URL.railway.app/api
     ```

2. **Redeploy:**
   - Push changes to your GitHub repository
   - Vercel will auto-deploy
   - Or manually trigger deployment in Vercel dashboard

### 4. 🔧 **Domain Configuration**

#### Cloudflare DNS Setup
1. Go to Cloudflare dashboard
2. Select dropzone-africa.com
3. Go to DNS settings
4. Add these records:
   ```
   Type: CNAME
   Name: @
   Target: your-vercel-app.vercel.app
   
   Type: CNAME  
   Name: www
   Target: your-vercel-app.vercel.app
   
   Type: CNAME
   Name: api
   Target: your-backend.railway.app
   ```

#### Update Vercel Domain Settings
1. In Vercel project settings
2. Go to Domains tab
3. Add custom domain: `dropzone-africa.com`
4. Add: `www.dropzone-africa.com`
5. Vercel will provide SSL certificates automatically

### 5. 🔐 **Security Configuration**

#### Generate Strong JWT Secret
Run this in terminal to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Update Backend CORS
The backend is already configured for your domain:
```javascript
origin: ['https://dropzone-africa.com', 'https://www.dropzone-africa.com']
```

### 6. 🧪 **Testing Checklist**

After deployment, test:
- [ ] Homepage loads at https://dropzone-africa.com
- [ ] Products load from database
- [ ] User registration works
- [ ] User login works
- [ ] Shopping cart functions
- [ ] Order placement works
- [ ] Admin dashboard accessible
- [ ] API health check: https://api.dropzone-africa.com/api/health

### 7. 📊 **Environment Variables Summary**

#### Backend (Railway/Render):
```env
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
JWT_SECRET=your-64-character-random-secret
PORT=8080
```

#### Frontend (Vercel):
```env
NODE_ENV=production
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

## 🎉 **Post-Deployment**

### Performance Monitoring
- Railway/Render provide built-in monitoring
- Vercel provides analytics
- Monitor API response times

### SSL Certificates
- Vercel provides automatic SSL for frontend
- Railway/Render provide automatic SSL for backend
- Cloudflare provides additional security layers

### Backup Strategy
- Supabase provides automatic backups
- Consider setting up database export schedules

## 🚨 **Troubleshooting**

### Common Issues:
1. **CORS Errors**: Check backend CORS configuration matches your domain
2. **API Not Found**: Verify backend URL in frontend configuration
3. **Database Connection**: Check Supabase environment variables
4. **Authentication Issues**: Verify JWT_SECRET is set properly

### Quick Debug:
```bash
# Test backend health
curl https://api.dropzone-africa.com/api/health

# Test products endpoint  
curl https://api.dropzone-africa.com/api/products
```

## 📞 **Support**

Your marketplace is production-ready! The deployment should take about 30-60 minutes total.

**Next Steps After Deployment:**
1. Test all functionality on live site
2. Add your product inventory
3. Set up payment processing (Stripe/PayPal)
4. Launch marketing campaigns

**Ready to go live with dropzone-africa.com!** 🚀