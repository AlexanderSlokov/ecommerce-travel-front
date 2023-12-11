import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Booking} from "@/models/Booking";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import axios from "axios";

const stripe = require('stripe')(process.env.STRIPE_SK);

// The main handler for checkout API calls
export default async function handler(req, res) {

    // Only allow POST requests, respond with an error for other methods
    if (req.method !== 'POST') {
        res.json('should be a POST request');
        return;
    }

    // Extract relevant data from the request body
    const {
        name,email,gender, phoneNumber, pickUpAddress,
        cartProducts,
    } = req.body;

    // Connect to the MongoDB database
    await mongooseConnect();

    // Deduplicate product IDs from the cart
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    // Retrieve product information from the database
    const productsInfos = await Product.find({_id:uniqueIds});


    // Initialize an array to hold items for Stripe checkout
    let line_items = [];
    for (const productId of uniqueIds) {

        // Find the product information for the current ID
        const productInfo = productsInfos.find(p => p._id.toString() === productId);

        // Count the quantity (participants) of each product in the cart
        const quantity = productsIds.filter(id => id === productId)?.length || 0;

        // If the product exists and has a quantity, add it to the line items
        if (quantity > 0 && productInfo) {
            line_items.push({
                price_data: {
                    currency: 'USD',
                    product_data: {name: productInfo.title},
                    unit_amount: quantity*productInfo.price * 100, // Assuming productInfo.price is already an integer representing the price in VND
                },
                quantity: quantity,
            });
        }
    }

    const session = await getServerSession(req, res, authOptions);

    // Create a booking document in the database with the provided information
    const bookingDoc = await Booking.create({
        line_items,name,email,gender, phoneNumber, pickUpAddress, paid:false,
        userEmail: session?.user?.email,
    });

    // Fetch the service fee percentage from the admin settings
    let serviceFeePercentage;
    try {
        const settingsResponse = await axios.get('http://localhost:4000/api/settings?name=serviceFee');
        serviceFeePercentage = settingsResponse.data.value;
    } catch (error) {
        console.error('Error fetching service fee:', error);
        res.status(500).json({ error: 'Error fetching service fee' });
        return;
    }

    let totalAmount = 0;

    // Calculate the total amount from line_items
    for (const line_item of line_items) {
        totalAmount += line_item.price_data.unit_amount;
    }

    // Calculate the service fee in cents as a fixed amount
    const serviceFee = Math.round(totalAmount * serviceFeePercentage / 100);
    const displayName = `Service Maintaining Fee (Charged ${serviceFeePercentage}%, this term is mentioned in cart section.)`;

    // Create a Stripe checkout session with the line items and other details
    const StripeSession = await stripe.checkout.sessions.create({
        line_items,
        mode:'payment',
        customer_email:email,
        success_url:process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url:process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata:{bookingId:bookingDoc._id.toString(), test:'ok'},
        allow_promotion_codes:true,
        shipping_options:[
            {
                shipping_rate_data:{
                    display_name:displayName,
                    type:"fixed_amount",
                    fixed_amount:{amount: serviceFee,currency:'USD'}
                }
            }
        ]
    });

    res.json({
        url:StripeSession.url,
    })
}

