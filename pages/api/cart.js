import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";

export default async function handle(req, res) {
    try {
        // Connect to the database
        await mongooseConnect();

        // Check if ids are provided in the request body
        if (!req.body.ids) {
            return res.status(400).send('No IDs provided');
        }

        const ids = req.body.ids;

        // Validate that ids is an array and not empty
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('Invalid IDs format');
        }

        // Query the database
        const products = await Product.find({ _id: ids });

        // Check if products are found
        if (!products || products.length === 0) {
            return res.status(404).send('No products found');
        }

        // Send the response
        res.json(products);
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error in handle function:', error);
        res.status(500).send('An unexpected error occurred');
    }
}
