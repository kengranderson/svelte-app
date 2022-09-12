import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']);

export async function GET() {
  const products = await stripe.products.list({
    limit: 50,
  });

  const prices = await stripe.prices.list({
    limit: 50,
  });

  return new Response(JSON.stringify({
    products: products.data,
    prices: prices.data
  }), {
    'Content-Type': 'application/json'
  });
}


