import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']);

export async function POST() {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    }
  });

  console.log('payment intent success!');
  console.log(paymentIntent);

  return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
  }), {
    'Content-Type': 'application/json'
  });
}


