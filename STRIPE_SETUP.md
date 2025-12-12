# Stripe Implementation - Setup Guide

### 1. Start the Application

**Terminal 1 - Backend:**

```bash
cd /app/server
npm run start
```

**Terminal 2 - Frontend:**

```bash
cd /app/client
npm run dev
```

**Terminal 3 - Stripe Webhook Forwarding:**

```bash
# If Stripe CLI not installed, run this first:
curl -s https://packages.stripe.com/api/v1/bintray/stripe-cli-linux-x64-latest.tar.gz | tar -xz && sudo mv stripe /usr/local/bin/

# Then start webhook forwarding:
stripe listen --forward-to localhost:3000/api/stripe/webhook --skip-verify
```

### 4. Test Card Numbers

-   **Success**: `4242 4242 4242 4242`
-   **Decline**: `4000 0000 0000 0002`
-   **Requires 3D Secure**: `4000 0025 0000 3155`
-   **Insufficient funds**: `4000 0000 0000 9995`

All cards accept any future expiry date and any 3-digit CVC.

---

## Technical Details

### Environment Variables

**Backend** (`/app/server/.env`):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend** (`/app/client/.env`):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
