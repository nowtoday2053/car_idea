# Deployment Guide

## Best Free Hosting: Vercel (Recommended)

**Vercel** is the best choice because:
- ✅ Made by the Next.js team - perfect compatibility
- ✅ Zero-config deployment
- ✅ Free tier (generous limits)
- ✅ Automatic HTTPS
- ✅ Environment variables support
- ✅ Automatic deployments from GitHub
- ✅ No credit card required

### Step-by-Step Deployment to Vercel

1. **Push your code to GitHub** (if you haven't already)
   - Follow the instructions in `GITHUB_SETUP.md`

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (free)

3. **Import your repository**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add these variables (from your `.env.local`):
     ```
     MARKETCHECK_API_KEY=your_key_here
     STRIPE_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     RESEND_API_KEY=re_... (optional, if you want email)
     NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
     ```

5. **Deploy!**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `https://your-app.vercel.app`

6. **Update Stripe Webhook**
   - After deployment, update your Stripe webhook URL to:
     `https://your-app.vercel.app/api/webhook`
   - Get the new webhook secret and update it in Vercel

### Vercel Free Tier Limits
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL certificates
- ✅ Custom domains (free)
- ✅ Serverless functions (100GB-hours/month)

---

## Alternative: Netlify (Also Free)

**Netlify** is another good option:

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

**Note**: Netlify requires a `netlify.toml` file for Next.js. You may need to add one.

---

## Alternative: Railway (Free Tier Available)

**Railway** offers a free tier:

1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from repository
4. Add environment variables
5. Railway auto-detects Next.js

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [x] All environment variables are documented in `env.example`
- [x] `.env` is in `.gitignore` (already done)
- [x] `node_modules` is in `.gitignore` (already done)
- [x] Build command works: `npm run build`
- [x] No hardcoded API keys or secrets
- [x] All dependencies are in `package.json`

## Testing the Build Locally

Before deploying, test that your build works:

```bash
npm run build
npm start
```

If this works locally, it will work on Vercel!

## Common Deployment Issues & Solutions

### Issue: Build fails with TypeScript errors
**Solution**: Run `npm run build` locally first and fix any TypeScript errors

### Issue: Environment variables not working
**Solution**: Make sure all `process.env` variables are prefixed with `NEXT_PUBLIC_` for client-side, or are server-side only

### Issue: Images not loading
**Solution**: Make sure images are in the `public/` folder (already done for `merc.png`)

### Issue: API routes returning 500 errors
**Solution**: Check Vercel function logs in the dashboard for detailed error messages

## Recommended: Vercel

**For this Next.js app, Vercel is strongly recommended** because:
- Zero configuration needed
- Best Next.js support
- Fastest deployment
- Free tier is perfect for this project







