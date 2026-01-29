# Rehearsal.AI Pricing Structure

## Credits System

1 credit = 1 hour of recording analysis (rounded up)

| Duration    | Credits Used |
| ----------- | ------------ |
| 0-60 min    | 1            |
| 61-120 min  | 2            |
| 121-180 min | 3            |

```typescript
const credits = Math.ceil(durationMinutes / 60);
```

## Credit Packs

| Pack       | Price | Per Credit | Savings |
| ---------- | ----- | ---------- | ------- |
| 1 credit   | £1.50 | £1.50      | -       |
| 5 credits  | £5.00 | £1.00      | 33% off |
| 10 credits | £8.00 | £0.80      | 47% off |

## Free Tier

New users receive **3 free credits** on signup.

## IAP Product IDs

```
rehearsal_credits_1
rehearsal_credits_5
rehearsal_credits_10
```

## RevenueCat

Using RevenueCat to handle IAP for both platforms.

| Platform | Store           | Fee    |
| -------- | --------------- | ------ |
| iOS      | Apple App Store | 15-30% |
| Android  | Google Play     | 15-30% |

**RevenueCat pricing:**

- Free up to $2.5k/month revenue
- 1% fee after that

**Flow:**

1. User buys in app via RevenueCat SDK (`react-native-purchases`)
2. RevenueCat validates with Apple/Google
3. RevenueCat sends webhook to API
4. API creates purchase record + increments `credits_remaining`

**Setup required:**

- RevenueCat account
- Products in App Store Connect + Google Play Console
- Mirror products in RevenueCat
- Bundle into "Offerings" (1/5/10 credit packs)
- Configure webhook endpoint

## Cost Analysis (per credit/hour)

| Service                 | Cost       |
| ----------------------- | ---------- |
| Whisper (~25min speech) | ~£0.03     |
| Claude analysis         | ~£0.02     |
| S3 storage              | ~£0.01     |
| **Total**               | **~£0.06** |

### Margins

| Pack               | Revenue      | After Apple 30% | Margin |
| ------------------ | ------------ | --------------- | ------ |
| 1 credit @ £1.50   | £1.50        | £1.05           | 94%    |
| 5 credits @ £5.00  | £1.00/credit | £0.70/credit    | 91%    |
| 10 credits @ £8.00 | £0.80/credit | £0.56/credit    | 89%    |
