import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {UserAccount} from "@/models/UserAccount"
export default async function handle(req, res) {
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);

    if (req.method === 'PUT') {
        // Because we use the email as a objetId, so we need to check the logged-in email as the same as user's email or not.
        const checkedEmail = await UserAccount.findOne({userEmail:user.email});

        if(checkedEmail) {
            console.log(req.body);
            res.json(await UserAccount.findByIdAndUpdate(
                checkedEmail._id, req.body,{ new: true }
            ));
        } else {
            // Create a new one
            res.json(await UserAccount.create(
                {userEmail:user.email, ...req.body}
            ));
        }
    }

    if (req.method === 'GET') {
        const checkedEmail = await UserAccount.findOne({userEmail:user.email},);
        res.json(checkedEmail);
    }


}