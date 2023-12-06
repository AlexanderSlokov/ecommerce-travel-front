import CenterModifier from "@/components/CenterModifier";
import Title from "@/components/Title";
import Header from "@/components/Header";
import {signIn, signOut, useSession} from "next-auth/react";
import Button from "@/components/Button";


export default function AccountPage() {
    // Provide user's section.
    const {data:session} = useSession();
    async function logout() {
        await signOut({callbackUrl:process.env.NEXT_PUBLIC_URL})
    }

    async function login() {
        await signIn('google', {
            callbackUrl:process.env.NEXT_PUBLIC_URL
        });
    }

    return(
        <>
        <Header/>
            <CenterModifier>
                <Title>Account</Title>
                {process.env.NEXT_PUBLIC_URL}
                {/*// If there was in a session, log out*/}
                {session && (
                    <Button
                        primary
                        onClick={logout}
                    >Logout</Button>
                )}
                {/*If not have any session, show the login*/}
                {!session && (
                    <Button
                        primary
                        onClick={login}
                    >Logout</Button>
                )}
            </CenterModifier>
        </>
    );
}