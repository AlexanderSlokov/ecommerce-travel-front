import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";

export default async function handle(req, res){
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);

    if (req.method === 'POST') {
        const {product} = req.body;
        const wishDoc = await WishedProduct.findOne({
            userEmail: user.email, product
        });

        if (wishDoc) {
            await WishedProduct.findByIdAndDelete(wishDoc._id);
            res.json('deleted');
        } else {
            await WishedProduct.create({
                userEmail:user.email, product
            });
            res.json('created');
        }
        res.json(true);
    }

    if ( req.method === 'GET') {
        res.json(
            await WishedProduct.find(
                {userEmail: user.email}).populate('product'),
        )
    }
}

// The upgraded version of api endpoint, increased stability and optimization, add error handling.
//
// import { mongooseConnect } from "@/lib/mongoose";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
// import { WishedProduct } from "@/models/WishedProduct";
//
// export default async function handle(req, res) {
//     await mongooseConnect();
//     const { user } = await getServerSession(req, res, authOptions);
//
//     // Assuming user is properly authenticated and user object is valid.
//     if (!user) {
//         return res.status(401).json({ message: "You must be signed in to manage your wishlist." });
//     }
//
//     try {
//         if (req.method === 'POST') {
//             // Create a new wishlist item
//             const { product } = req.body;
//             const existingProduct = await WishedProduct.findOne({ userEmail: user.email, product });
//
//             if (existingProduct) {
//                 return res.status(409).json({ message: "Product is already in the wishlist." });
//             } else {
//                 const newWish = await WishedProduct.create({ userEmail: user.email, product });
//                 return res.status(201).json(newWish);
//             }
//         } else if (req.method === 'DELETE') {
//             // Remove an item from the wishlist
//             const { product } = req.body;
//             const deletionResult = await WishedProduct.findOneAndDelete({ userEmail: user.email, product });
//
//             if (deletionResult) {
//                 return res.json({ message: "Product removed from wishlist." });
//             } else {
//                 return res.status(404).json({ message: "Product not found in wishlist." });
//             }
//         } else if (req.method === 'GET') {
//             // Retrieve the wishlist items
//             const wishlistItems = await WishedProduct.find({ userEmail: user.email }).populate('product');
//             return res.json(wishlistItems);
//         } else {
//             // Handle unsupported methods
//             res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
//             return res.status(405).end(`Method ${req.method} Not Allowed`);
//         }
//     } catch (error) {
//         console.error('Wishlist API error:', error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// }