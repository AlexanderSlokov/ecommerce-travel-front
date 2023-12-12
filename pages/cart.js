import Header from "@/components/Header";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import {useSession} from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr .7fr;
  }
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
    table thead tr th:nth-child(3),
    table tbody tr td:nth-child(3),    
    table tbody tr.subtotal td:nth-child(3){
        text-align: right;
        
    }
    table tr.subtotal td{
        padding: 15px 0;
    }
    table tbody tr.subtotal td:nth-child(2){
        font-size: 1.4rem;
    }
    tr.total td{
        font-weight: bold;
    }
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
  @media screen and (min-width: 768px) {
    padding: 10px;
  }
`;

const QuantityLabel = styled.div`
  padding: 0 3px;
  //display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 768px) {
    display: inline-block;
  }
`;

const AddressHolder = styled.div`
  display: flex;
`;

function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CartPage() {
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const {data:session} = useSession();
    const [products, setProducts] = useState([]);
    const [name, setName]  = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pickUpAddress, setPickUpAddress] = useState('');
    const [serviceFee, setServiceFee] = useState(null);
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
        axios.get('/api/settings?name=serviceFee').then(r => {
            setServiceFee(r.data.value);
        })
    }, []);


    useEffect(() => {
        if(!session) {
            return
        }
        axios.get('/api/userAccount').then(r => {
            setName(r.data?.name);
            setGender(r.data?.gender);
            setPhoneNumber(r.data?.phoneNumber);
            setEmail(r.data?.email);
            setPickUpAddress(r.data?.pickUpAddress);
        });
    }, [session]);

    function moreOfThisProduct(id) {
            addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    function feeCalc(total, fee){
        // Return the service fee as a number, not as a fixed string.
        return (total * (fee / 100)).toFixed(2);
    }

    function totalSum(total, fee){
        // Make sure both total and fee are numbers and add them.
        return parseFloat(total) + parseFloat(fee);
    }

    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, gender, email, phoneNumber, pickUpAddress, cartProducts
        });

        if (response.data.url) {
            window.location = response.data.url;
        }
    }

    // Calculating the total price of tours inside the cart.
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
                                           new Intl.DateTimeFormat('en-GB', {
                                               day: '2-digit',
                                               month: '2-digit',
                                               year: '2-digit'
                                           })
                                               .format(new Date(product.startDate))
                                       } to {
                                           new Intl.DateTimeFormat('en-GB', {
                                               day: '2-digit',
                                               month: '2-digit',
                                               year: '2-digit'
                                           })
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
                           <tr className={"subtotal"}>
                               <td colSpan={2}> Tour(s) price:</td>
                               <td>{numberWithCommas(total)} USD</td>
                           </tr>

                           <tr className={"subtotal"}>
                               <td colSpan={2}>Service Maintaining Fee: <br/> <br/>
                                   {serviceFee}% of the booking price.<br/> <br/>
                                   This fee contributes to: <br/>
                                   * Employee salary payments. <br/>
                                   * Web server maintenance.<br/>
                                   * Transaction fees for using Stripe's payment platform.<br/>
                                   * Services enhancing your experience, such as tour arrangements and guide fees.<br/>
                                   <br/>
                                   (Note: This fee is essential for providing high-quality services and is not merely for profit.)<br/>

                               </td>
                               <td>{feeCalc(total, serviceFee)} USD</td>
                           </tr>

                           <tr className={"total"}>
                               <td colSpan={2}> Total:</td>
                               <td>{numberWithCommas(totalSum(total, feeCalc(total, serviceFee)).toFixed(2))} USD</td>
                           </tr>
                           </tbody>
                       </Table>
                       )}

                       <h4>Disclaimer: <br/>
                           1. Please pay attention to spend enough break time to move between your tours' locations. <br/>
                           <br/>
                           2. "Children" term here is understood as equal or younger than 7 years old. <br/>
                           <br/>
                           3. Your children will be served as full quality without payment. <br/>
                           <br/>
                           4. Only adults and above 7 years old are charged fees.
                       </h4>
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