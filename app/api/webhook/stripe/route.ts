import stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST(request: Request) {
    const body = await request.text()

    const sig = request.headers.get('stripe-signature') as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err) {
        return NextResponse.json({ message: 'Webhook error', error: err })
    }

    // Get the ID and type
    const eventType = event.type

    // CREATE
    if (eventType === 'checkout.session.completed') {
        const { id, amount_total, metadata } = event.data.object

        const order = {
            stripeId: id,
            eventId: metadata?.eventId || '',
            buyerId: metadata?.buyerId || '',
            totalAmount: amount_total ? (amount_total / 100).toString() : '0',
            createdAt: new Date(),
        }

        const newOrder = await createOrder(order)
        return NextResponse.json({ message: 'OK', order: newOrder })
    }

    return new Response('', { status: 200 })
}


// // server.js
// //
// // Use this sample code to handle webhook events in your integration.
// //
// // 1) Paste this code into a new file (server.js)
// //
// // 2) Install dependencies
// //   npm install stripe
// //   npm install express
// //
// // 3) Run the server on http://localhost:4242
// //   node server.js

// // The library needs to be configured with your account's secret key.
// // Ensure the key is kept out of any version control system you might be using.
// const stripe = require('stripe')('sk_test_...');
// const express = require('express');
// const app = express();


// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_fa9b580d03b3b4c20e897bea460d79afdcfb8a6352a5895eeacacb27fe67738e";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const checkoutSessionCompleted = event.data.object;
//       // Then define and call a function to handle the event checkout.session.completed
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));