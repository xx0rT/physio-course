# Stripe Integration Setup Guide

This guide will help you complete the Stripe integration setup for your learning platform.

## Prerequisites

You have already:
- ✅ Stripe API keys configured
- ✅ Database tables created
- ✅ Edge functions deployed
- ✅ Checkout page implemented

## Step 1: Create Stripe Products

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)

2. Click **"+ Add product"**

### Product 1: Monthly Subscription

- **Name**: Monthly Learning Subscription
- **Description**: Access to all courses with monthly billing
- **Pricing**:
  - **Type**: Recurring
  - **Price**: $29.99
  - **Billing period**: Monthly
  - **Currency**: USD
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)
- Update `src/pages/Checkout.tsx` line 40:
  ```typescript
  priceId: 'price_YOUR_MONTHLY_PRICE_ID_HERE',
  ```

### Product 2: Lifetime Access

- **Name**: Lifetime Learning Access
- **Description**: One-time payment for lifetime access to all courses
- **Pricing**:
  - **Type**: One time
  - **Price**: $299.99
  - **Currency**: USD
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)
- Update `src/pages/Checkout.tsx` line 56:
  ```typescript
  priceId: 'price_YOUR_LIFETIME_PRICE_ID_HERE',
  ```

## Step 2: Set Up Webhook Endpoint

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)

2. Click **"+ Add endpoint"**

3. Configure the webhook:
   - **Endpoint URL**: `https://lrupnyrbcnqhhmhjrbcc.supabase.co/functions/v1/stripe-webhook`
   - **Description**: Learning Platform Webhook
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`

4. Click **Add endpoint**

5. **Copy the Webhook Signing Secret** (starts with `whsec_...`)

## Step 3: Add Secrets to Supabase

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref lrupnyrbcnqhhmhjrbcc
   ```

3. Add the Stripe secrets:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_51...BaV
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

   Replace with your actual keys:
   - Secret Key: Your Stripe secret key (already provided)
   - Webhook Secret: The webhook signing secret from Step 2

4. Verify secrets are set:
   ```bash
   supabase secrets list
   ```

## Step 4: Deploy Edge Functions

Deploy the Stripe edge functions to your Supabase project:

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
```

## Step 5: Test the Integration

### Test with Stripe Test Cards

Use these test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

For all test cards:
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Testing Flow

1. Navigate to `/checkout` in your application
2. Select a plan (Monthly or Lifetime)
3. Click "Proceed to Secure Checkout"
4. You'll be redirected to Stripe Checkout
5. Use a test card to complete payment
6. You'll be redirected back to `/courses?success=true`
7. Verify subscription is active

### Verify in Database

Check the `stripe_subscriptions` table in Supabase:

```sql
SELECT * FROM stripe_user_subscriptions;
```

You should see your subscription with status 'active'.

## Troubleshooting

### Issue: "Stripe products not configured" error

**Solution**: You haven't created the products in Stripe or haven't updated the price IDs in `Checkout.tsx`

### Issue: Webhook not receiving events

**Solution**:
1. Verify webhook URL is correct
2. Check that webhook secret is set in Supabase secrets
3. Test webhook in Stripe Dashboard → Webhooks → Your webhook → Send test webhook

### Issue: Payment succeeds but subscription not created

**Solution**:
1. Check Supabase edge function logs:
   ```bash
   supabase functions logs stripe-webhook
   ```
2. Verify webhook secret matches
3. Check that all required events are selected

### Issue: Edge functions not working

**Solution**:
1. Redeploy the functions:
   ```bash
   supabase functions deploy stripe-checkout
   supabase functions deploy stripe-webhook
   ```
2. Check function logs for errors:
   ```bash
   supabase functions logs stripe-checkout
   supabase functions logs stripe-webhook
   ```

## Production Checklist

Before going live:

- [ ] Switch from test keys to live keys in Supabase secrets
- [ ] Update webhook endpoint to use production webhook secret
- [ ] Test live payment flow with real card
- [ ] Set up Stripe email receipts
- [ ] Configure Stripe billing portal for subscription management
- [ ] Review and update product prices
- [ ] Set up proper error monitoring
- [ ] Test subscription cancellation flow
- [ ] Verify webhook events are being processed correctly

## Additional Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Support

If you encounter issues:
1. Check Supabase edge function logs
2. Review Stripe webhook events
3. Verify all secrets are correctly set
4. Test with Stripe test cards first
