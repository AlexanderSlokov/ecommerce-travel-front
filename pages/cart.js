import Header from "@/components/Header";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";



const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr .7fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
 img{
   max-width: 150px;
   max-height: 150px;
 } 
`;

const ProductImageBox = styled.div`
  max-width: 150px;
  max-height: 150px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0, 0.1);
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  
`;

const QuantityLabel = styled.div`
    padding: 0 5px;
`;

const AddressHolder = styled.div`
  display: flex;
`;

function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CartPage() {
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);

    const [products, setProducts] = useState([]);
    const [name, setName]  = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pickUpAddress, setPickUpAddress] = useState('');

    const [isSuccess, setIsSuccess] = useState(false);


    useEffect(() => {
        if(cartProducts.length > 0 ) {
            axios.post('/api/cart', {ids:cartProducts}).then(response => {
                setProducts(response.data);
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window === "undefined"){
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, []);

    function moreOfThisProduct(id) {
            addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, gender, email, phoneNumber, pickUpAddress, cartProducts
        });

        if (response.data.url) {
            window.location = response.data.url;
        }
    }

    // Calculating total price of tours inside the cart.
    let total = 0;
    for (const productId of cartProducts) {
        // Find the product have that id, and take the price value, put it in the const
        const price  = products.find(p => p._id === productId)?.price || 0;
            total += price;
    }

    if (isSuccess) {
        return (
            <>
            <Header/>
                <CenterModifier>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thanks for your interested!</h1>
                            <p>We will email you when the tour is ready to go.</p>
                        </Box>
                    </ColumnsWrapper>
                </CenterModifier>
            </>
        );
    }


    return (
       <>
        <Header/>
           <CenterModifier>
               <ColumnsWrapper>
                   <Box>
                       <h2>You are planning to visit:</h2>
                       {!cartProducts?.length && (
                           <div>
                               <h3>Hmm, nothing selected...</h3>
                               Maybe we can go around and grape some places for our trip first, yes?
                           </div>
                       )}
                       {cartProducts?.length > 0 && (
                       <Table>
                           <thead>
                               <tr>
                                   <th>Tour</th>
                                   <th width={'100%'} align={"center"}>Participants</th>
                                   <th>Price</th>
                               </tr>
                           </thead>

                           <tbody>
                           {products.map(product => (
                                   <tr>
                                       <ProductInfoCell>
                                           <ProductImageBox>
                                               <img src={product.images[0]} alt=""/>
                                           </ProductImageBox>
                                           {product.title}

                                           <div>From: {
                                               new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                                   .format(new Date(product.startDate))
                                           } to {
                                               new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                                   .format(new Date(product.endDate))
                                           }</div>
                                       </ProductInfoCell>

                                       <td align={"center"}>
                                           <Button
                                               onClick={() => moreOfThisProduct(product._id)
                                           }>+</Button>
                                           <QuantityLabel>
                                               {cartProducts.filter(id => id === product._id).length}
                                           </QuantityLabel>
                                           <Button
                                           onClick={() => lessOfThisProduct(product._id)}
                                           >-</Button>
                                       </td>
                                       <td>{numberWithCommas(cartProducts.filter(id => id === product._id).length * product.price)} USD</td>
                                   </tr>
                           ))}
                           <tr>
                              <td></td>
                               <td></td>
                               <td>{numberWithCommas(total)} USD</td>
                           </tr>
                           </tbody>
                       </Table>
                       )}

                       <h4>Disclaimer: Please pay attention to spend enough break time to move between locations. Although we can provide free postponement.</h4>
                   </Box>

                   {!!cartProducts?.length && (
                       <Box>
                           <h2>Fast address information</h2>
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
                               <Button block black onClick={goToPayment}>Continue to payment section</Button>
                       </Box>
                   )}
               </ColumnsWrapper>
           </CenterModifier>
        </>
   )
}