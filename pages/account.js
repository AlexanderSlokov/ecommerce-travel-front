import CenterModifier from "@/components/CenterModifier";
import Header from "@/components/Header";
import {signIn, signOut, useSession} from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import Input from "@/components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin: 40px 0;
`;

const AddressHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function AccountPage() {
    // Provide user's section.
    const {data:session} = useSession();

    const [name, setName]  = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pickUpAddress, setPickUpAddress] = useState('');

    const [wishedProducts, setWishedProducts]=useState([]);
    const [AccountInfoLoaded, setAccountInfoLoaded] = useState(false);
    const [wishListLoaded, setWishListLoaded] = useState(false);

    //react hook to fill the information about logged-in user.
    useEffect(() => {
        axios.get('/api/userAccount').then(r => {
            setName(r.data?.name);
            setGender(r.data?.gender);
            setPhoneNumber(r.data?.phoneNumber);
            setEmail(r.data?.email);
            setPickUpAddress(r.data?.pickUpAddress);
            setAccountInfoLoaded(true);
        });

        // also load wished product into wishlist section of account page
        axios.get('/api/wishlist').then(r =>{
            // console.log(r.data);
            setWishedProducts(r.data.map(wp =>
                wp.product
            ));

            setWishListLoaded(true);
        });

    }, []);

    async function logout() {
        await signOut({callbackUrl:process.env.NEXT_PUBLIC_URL})
    }

    async function login() {
        await signIn('google', {
            callbackUrl:process.env.NEXT_PUBLIC_URL
        });
    }

    function saveAccountInfo (){
        const data = {name, gender, email, phoneNumber, pickUpAddress};
        axios.put('/api/userAccount', data);
    }

    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts((products) => {
            // Filter out the product that has the ID to remove
            return products.filter((p) => p._id.toString() !== idToRemove);
        });
    }

    return(
        <>
        <Header/>
            <CenterModifier>
                <ColsWrapper>
                    <div>
                        <WhiteBox>
                            <h2>Wishlist</h2>
                            {!wishListLoaded && (
                                <Spinner fullWidth={true}/>
                            )}
                            {wishListLoaded && (
                                <WishedProductsGrid>
                                    { wishedProducts.length > 0 && wishedProducts.map(wp =>(
                                        <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishList={productRemovedFromWishlist}/>
                                    ))}

                                    {wishedProducts.length === 0 && (
                                        <>
                                        <p>Maybe we can hang out a bit and see what tour you will interested in, yes?</p>
                                        </>
                                    )}
                                </WishedProductsGrid>
                            )}
                        </WhiteBox>
                    </div>

                    <div>
                        <WhiteBox>
                            <h2>Account Detail</h2>
                            {!AccountInfoLoaded && (
                                <Spinner fullWidth={true}/>

                            )}

                            {AccountInfoLoaded && (
                                <>
                                    <Input
                                        type="text"
                                        placeholder={"Your full name"}
                                        value={name}
                                        name={"name"}
                                        onChange={ev => setName(ev.target.value)}
                                    />

                                    <Input
                                        type="text"
                                        placeholder={"Gender, as Male or Female"}
                                        value={gender}
                                        name={"gender"}
                                        onChange={ev => setGender(ev.target.value)}
                                    />

                                    <Input
                                        type="text"
                                        placeholder={"Phone number"}
                                        value={phoneNumber}
                                        name={"phoneNumber"}
                                        onChange={ev => setPhoneNumber(ev.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        placeholder={"Email"}
                                        value={email}
                                        name={"email"}
                                        onChange={ev => setEmail(ev.target.value)}
                                    />
                                    <AddressHolder>
                                        <Input type="text"
                                               placeholder={" Pickup Address"}
                                               value={pickUpAddress}
                                               name={"pickUpAddress"}
                                               onChange={ev => setPickUpAddress(ev.target.value)}/>
                                    </AddressHolder>

                                    <Button black block onClick={saveAccountInfo}>Save</Button>
                                </>
                            )}

                            <hr/>
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

                        </WhiteBox>
                    </div>
                </ColsWrapper>
            </CenterModifier>
        </>
    );
}