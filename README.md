# Car Price Checker

A professional web application that helps users determine if a car is overpriced by analyzing market data and providing detailed reports. Supports two pricing check options: Quick Check and Full VIN Report - both $4.99.

## Features

- **Two Pricing Options** (Both $4.99):
  - **Quick Check**: Enter car details manually - perfect when you don't have a VIN
  - **Full VIN Report**: Most accurate pricing with VIN-based analysis and vehicle history
- **Smart Adjustments**: Automatic price adjustments for accidents, condition, and mileage
- **Stripe Payment Integration**: Secure one-time payment processing
- **MarketCheck API Integration**: Real-time market value data from thousands of listings
- **Location-Based Pricing**: ZIP code-based market analysis for accurate regional pricing
- **PDF Report Generation**: Downloadable detailed reports with all analysis data
- **Email Delivery**: Automated email delivery with PDF attachments
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Payment**: Stripe Checkout
- **API**: MarketCheck API (free tier: 500 calls/month)
- **Email**: Resend (free tier available)
- **PDF**: jsPDF
- **Hosting**: Vercel (recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MarketCheck API
MARKETCHECK_API_KEY=your_marketcheck_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Get API Keys

#### MarketCheck API
1. Sign up at [MarketCheck](https://www.marketcheck.com/)
2. Get your API key from the dashboard
3. Free tier includes 500 calls/month

#### Stripe
1. Create an account at [Stripe](https://stripe.com/)
2. Get your test API keys from the dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhook`
4. For production, use live keys

#### Resend
1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Verify your domain for production emails
4. Update the `from` email in `app/api/send-report/route.ts`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/)
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
car idea/
├── app/
│   ├── api/
│   │   ├── create-payment-intent/    # Stripe payment creation
│   │   ├── market-data/               # MarketCheck API integration (handles both check types)
│   │   ├── send-report/               # Email sending with PDF
│   │   └── webhook/                   # Stripe webhook handler
│   ├── data/
│   │   └── carMakesModels.ts          # Car makes and models data
│   ├── checkout/                      # Checkout page (handles both pricing tiers)
│   ├── quick-check/                   # Quick Check form page
│   ├── vin-check/                     # VIN Check form page
│   ├── results/                       # Results page (handles both check types)
│   ├── thank-you/                     # Thank you page
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Homepage with two pricing options
│   └── globals.css                    # Global styles
├── public/                            # Static assets
├── env.example                        # Environment variables template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## User Flow

### Quick Check Flow ($2.99)
1. **Homepage**: User selects "Quick Check" option
2. **Quick Check Form**: User enters car details (year, make, model, trim, mileage, condition, accidents, ZIP code, asking price)
3. **Checkout**: User enters email and completes Stripe payment ($2.99)
4. **Results**: System fetches market data, applies adjustments, and displays analysis
5. **Email**: PDF report is automatically sent to user's email
6. **Thank You**: Confirmation page with next steps

### Full VIN Report Flow ($4.99)
1. **Homepage**: User selects "Full VIN Report" option
2. **VIN Check Form**: User enters VIN (and optionally asking price) and email
3. **Checkout**: User completes Stripe payment ($4.99)
4. **Results**: System decodes VIN, fetches precise market data, and displays comprehensive analysis
5. **Email**: PDF report with vehicle history is automatically sent to user's email
6. **Thank You**: Confirmation page with next steps

## Features in Detail

### Quick Check Features
- Manual car details entry (year, make, model, trim, mileage, condition, accidents, ZIP code)
- Dynamic model dropdown based on selected make
- Location-based pricing (100-mile radius from ZIP code)
- Automatic adjustments for:
  - Accident history (10-15% reduction)
  - Condition (Fair: 7.5%, Poor: 15% reduction)
  - Mileage (based on age and expected mileage)
- Negotiation range recommendations

### VIN Report Features
- VIN validation (17 characters, no I/O/Q)
- Automatic vehicle specification decoding
- Precise VIN-based market value
- Vehicle history and service records
- Most accurate pricing available

### Price Analysis
- Compares asking price to market average (and adjusted value for Quick Check)
- Shows price range (low to high)
- Displays number of similar listings analyzed
- Provides recommendation based on price difference
- Shows negotiation range for Quick Check

### PDF Report
- Professional 1-page report
- Includes all analysis data
- Downloadable from results page
- Automatically attached to email

### Error Handling
- Invalid VIN detection
- API failure handling
- Payment error recovery
- User-friendly error messages

## Notes

- The app uses mock data when `MARKETCHECK_API_KEY` is not set (for development)
- Email sending is skipped if `RESEND_API_KEY` is not set
- All sensitive data is stored in environment variables
- Session storage is used for client-side data persistence

## Future Enhancements

- User accounts and search history
- Bulk VIN checking
- Advanced filtering options
- Vehicle history reports
- Price alerts

## License

MIT

