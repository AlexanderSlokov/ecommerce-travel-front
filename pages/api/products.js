import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
export default async function handle(req, res) {
    const { method } = req;

    try {
        await mongooseConnect();

        if (method === 'GET') {
            let response;
            if (req.query?.id) {
                response = await Product.findOne({_id: req.query.id});
            } else {
                response = await Product.find();
            }
            res.json(response);
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        res.status(500).json({ message: "Error processing your request" });
    }
}