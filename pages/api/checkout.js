import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Booking} from "@/models/Booking";

const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.json('should be a POST request');
        return;
    }

    const {
        name,email,gender, phoneNumber, pickUpAddress,
        cartProducts,
    } = req.body;

    await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id:uniqueIds});

    const line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                price_data: {
                    currency: 'USD',
                    product_data: {name: productInfo.title},
                    unit_amount: productInfo.price * 100, // Assuming productInfo.price is already an integer representing the price in VND
                },
                quantity: quantity,
            });
        }
    }


    const bookingDoc = await Booking.create({
        line_items,name,email,gender, phoneNumber, pickUpAddress, paid:false,
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        payment_method_types: ['card'],
        mode:"payment",
        customer_email:email,
        success_url:process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url:process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata:{bookingId:bookingDoc._id.toString()},
    });

    res.json({
        url:session.url,
    })
}

