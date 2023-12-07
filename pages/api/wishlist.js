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
