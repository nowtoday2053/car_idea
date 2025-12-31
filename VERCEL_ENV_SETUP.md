# Vercel Environment Variables Setup Guide

## ✅ Required Environment Variables

Based on your `.env` file, here are the variables you need to add in Vercel:

### 1. MarketCheck API
```
MARKETCHECK_API_KEY=your_marketcheck_api_key_here
```

### 2. Stripe Keys
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Stripe Webhook Secret ⚠️ IMPORTANT
```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```
**Note:** This is currently a placeholder. You need to:
1. Deploy your app first (without this working)
2. Get your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
3. Go to Stripe Dashboard → Developers → Webhooks
4. Add endpoint: `https://your-app.vercel.app/api/webhook`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Update this variable in Vercel with the real secret

### 4. Resend API (Optional - for email)
```
RESEND_API_KEY=re_your_resend_api_key_here
```

### 5. Site URL (Add this!)
```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```
**Important:** Replace `your-app.vercel.app` with your actual Vercel deployment URL after first deployment.

---

## 📝 How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: The variable name (e.g., `MARKETCHECK_API_KEY`)
   - **Value**: The actual value
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

---

## 🔄 After First Deployment

1. **Get your deployment URL** from Vercel (e.g., `https://car-price-checker.vercel.app`)

2. **Update `NEXT_PUBLIC_SITE_URL`** in Vercel:
   ```
   NEXT_PUBLIC_SITE_URL=https://car-price-checker.vercel.app
   ```

3. **Set up Stripe Webhook**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
   - Click **Add endpoint**
   - Endpoint URL: `https://your-app.vercel.app/api/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel with the real secret

4. **Redeploy** your app (Vercel will auto-redeploy when you update env vars, or trigger manually)

---

## ✅ Checklist

- [x] MARKETCHECK_API_KEY added
- [x] STRIPE_SECRET_KEY added
- [x] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY added
- [ ] STRIPE_WEBHOOK_SECRET updated (after webhook setup)
- [x] RESEND_API_KEY added (optional)
- [ ] NEXT_PUBLIC_SITE_URL added (after first deployment)

---

## 🚨 Common Issues

**Issue:** Webhook not working
- **Solution:** Make sure `STRIPE_WEBHOOK_SECRET` is set correctly and matches the secret from Stripe dashboard

**Issue:** Stripe payments failing
- **Solution:** Verify both Stripe keys are correct and match your Stripe account (test vs live keys)

**Issue:** MarketCheck API not working
- **Solution:** Check that `MARKETCHECK_API_KEY` is correct and has remaining API calls



