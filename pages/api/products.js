import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default async function handle(req, res) {
    await mongooseConnect();
    const {categories, sort, ...filters} = req.query;

    const [sortField, sortOrder] = sort.split('-');

    const productsQuery = {
        category: categories ? categories.split(',') : [],
    };

    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(filterName => {
            productsQuery['properties.' + filterName] = filters[filterName];
        });

    }
    console.log(productsQuery);
    res.json(await Product.find(
        productsQuery, null,
        {sort:{[sortField]:sortOrder==='asc' ? 1 : -1}}
    ));
}
// const { method } = req;
//
// try {
//     await mongooseConnect();
//
//     if (method === 'GET') {
//         const { categories, ...filters } = req.query;
//         let response;
//
//         // If an id query is present, find one product
//         if (req.query?.id) {
//             response = await Product.findOne({ _id: req.query.id });
//         } else {
//             // Otherwise, find all products with optional category and filters
//             const categoryArray = categories ? categories.split(',') : [];
//             response = await Product.find({
//                 ...(categories && { category: categoryArray }),
//                 ...filters,
//             });
//         }
//         // Send the response once
//         res.json(response);
//     } else {
//         // Handle unsupported methods
//         res.setHeader('Allow', ['GET']);
//         res.status(405).end(`Method ${method} Not Allowed`);
//     }
// } catch (error) {
//     console.error("Error connecting to MongoDB", error);
//     res.status(500).json({ message: "Error processing your request" });
// }
