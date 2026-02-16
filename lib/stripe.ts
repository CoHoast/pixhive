import Stripe from 'stripe';
import { Plan, PLAN_PRICES } from './types';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICES: Record<Exclude<Plan, 'free'>, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  plus: process.env.STRIPE_PRICE_PLUS!,
  pro: process.env.STRIPE_PRICE_PRO!,
};

export async function createCheckoutSession(
  customerId: string | null,
  email: string,
  plan: Exclude<Plan, 'free'>,
  eventId: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : email,
    line_items: [
      {
        price: STRIPE_PRICES[plan],
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}?canceled=true`,
    metadata: {
      eventId,
      plan,
    },
  });

  return session.url!;
}

export async function createBillingPortalSession(
  customerId: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return session.url;
}

export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string | null
): Promise<string> {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  return customer.id;
}
