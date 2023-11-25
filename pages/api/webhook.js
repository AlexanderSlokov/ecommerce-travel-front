import {mongooseConnect} from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';
import {Booking} from "@/models/Booking";

const endpointSecret = "whsec_8cde22492d232702d311eed55041e6c38d9cdf05f00a05077253ecc69d211b92";
export default async function handler(req, res) {
    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            const bookingId = data.metadata.bookingId;
            const paid = data.payment_status === 'paid';
            if (bookingId && paid) {
                await Booking.findByIdAndUpdate(bookingId, {paid: true,});
            }

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('ok');
}
// Done! The Stripe CLI is configured for test-ecommerce with account id acct_1OG1v2KCLiQAfgJe
//plush-amity-happy-zippy
export const config  = {
    api:{bodyParser: false,}
}