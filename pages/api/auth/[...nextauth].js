import {MongoDBAdapter} from "@auth/mongodb-adapter";
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from "@/lib/mongodb";

export const authOptions = {
    DefaultAdapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_FRONT_ID,
            clientSecret: process.env.GOOGLE_FRONT_SECRET,
        }),
    ],
};

export default NextAuth(authOptions);
