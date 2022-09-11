import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']);

export async function POST({ request }) {
  let body = await request.json();

  const paymentIntent = body.id ?
    await stripe.paymentIntents.update(
      body.id,
      { amount: body.amount }
    ) :
    await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
      receipt_email: 'keng@semanticdev.com',
      automatic_payment_methods: {
        enabled: true,
      }
    });

  return new Response(JSON.stringify(paymentIntent), {
    'Content-Type': 'application/json'
  });
}


