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
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/Order";

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ColsWrapper = styled.div`
  display: grid;
  //grid-template-columns: 1.2fr .8fr; /* Maintain the fractional relationship but add a minimum width */
  grid-template-columns: minmax(min-content, 1.2fr) minmax(320px, .8fr);
  gap: 40px;
  margin: 40px 0;

  > div:first-child {
    min-width: 0; /* To respect the grid's size, needed for text overflow in grid */
  }
  
  > div:last-child {
    min-width: 320px; /* Set a minimum width for the account detail box */
  }

  @media screen and (min-width: 768px) { /* Adjust breakpoint as needed */
    grid-template-columns: 1fr; /* Stack the columns on smaller screens */
    > div:last-child {
      min-width: 0; /* Allow the account detail box to adjust to the full width on smaller screens */
    }
  }
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
    const [AccountInfoLoaded, setAccountInfoLoaded] = useState(true);
    const [wishListLoaded, setWishListLoaded] = useState(true);

    const [orders, setOrders] = useState([]);
    const [orderLoaded, setOrderLoaded] = useState(false);

    const [activeTab, setActiveTab] = useState('Orders');

    //react hook to fill the information about logged-in user.
    useEffect(() => {
        if (!session) {
            //Upgrade, Reset states when there is no session
            setName('');
            setGender('');
            setPhoneNumber('');
            setEmail('');
            setPickUpAddress('');
            setWishedProducts([]);
            setOrders([]);
            return;
        }
        setAccountInfoLoaded(false);
        setWishListLoaded(false);
        setOrderLoaded(false);

        axios.get('/api/userAccount').then(r => {
            setName(r.data?.name);
            setGender(r.data?.gender);
            setPhoneNumber(r.data?.phoneNumber);
            setEmail(r.data?.email);
            setPickUpAddress(r.data?.pickUpAddress);
            setAccountInfoLoaded(true);
        });

        // also a load wished product into a wishlist section of account page
        axios.get('/api/wishlist').then(r =>{
            // console.log(r.data);
            setWishedProducts(r.data.map(wp => wp.product));
            setWishListLoaded(true);
        });

        axios.get('/api/orders').then(r =>  {
            setOrders(r.data);
            setOrderLoaded(true);
        });

    }, [session]);

    async function logout() {
        //Up, Reset states before logging out
        setOrderLoaded(false);
        setWishListLoaded(false);
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
                            <Tabs tabs={['Orders', 'Wishlist']}
                                  active={activeTab}
                                  onChange={setActiveTab}
                            />
                            {!session ? (
                                // This message shows when there is no user session
                                <p>Login first to use the features, my friend.</p>
                            ) : (
                                // This content shows when there is a user session
                                <>
                                    {activeTab === 'Orders' && (
                                        <>
                                            {!orderLoaded ? (
                                                // Show spinner while orders are loading
                                                <Spinner fullWidth={true}/>
                                            ) : orders.length === 0 ? (
                                                // Show a message if there are no orders
                                                <p>Maybe we can buy something?</p>
                                            ) : (
                                                // Show orders if they exist
                                                orders.map(order => (
                                                    <SingleOrder key={order._id} {...order}/>
                                                ))
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'Wishlist' && (
                                        <>
                                            {!wishListLoaded ? (
                                                // Show spinner while the wishlist is loading
                                                <Spinner fullWidth={true}/>
                                            ) : wishedProducts.length === 0 ? (
                                                // Show a message if the wishlist is empty
                                                <p>Maybe we can hang out a bit and see what tour you will be interested in, yes?</p>
                                            ) : (
                                                // Show wished products if they exist
                                                <WishedProductsGrid>
                                                    {wishedProducts.map(product => (
                                                        <ProductBox
                                                            key={product._id}
                                                            {...product}
                                                            wished={true}
                                                            onRemoveFromWishlist={productRemovedFromWishlist}
                                                        />
                                                    ))}
                                                </WishedProductsGrid>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </WhiteBox>
                    </div>

                    <div>
                        <WhiteBox>
                            <h2>{session ? 'Account Detail' : 'Login'}</h2>
                            {!AccountInfoLoaded && (
                                <Spinner fullWidth={true}/>

                            )}
                            {AccountInfoLoaded && session && (
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
                                >Login with Google</Button>
                            )}

                        </WhiteBox>
                    </div>
                </ColsWrapper>
            </CenterModifier>
        </>
    );
}