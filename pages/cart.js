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


function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CartPage() {
    const {cartProducts, addProduct, removeProduct} = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(cartProducts.length > 0 ) {
            axios.post('/api/cart', {ids:cartProducts}).then(response => {
                setProducts(response.data);
            })
        }
    }, [cartProducts]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    let total = 0;
    for (const productId of cartProducts) {
        // Find the product have that id, and take the price value, put it in the const
        const price  = products.find(p => p._id === productId)?.price || 0;
            total += price;
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
                                           <label>{product.startDate}</label>
                                           <label>{product.endDate}</label>

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
                                       <td>{numberWithCommas(cartProducts.filter(id => id === product._id).length * product.price)} VND</td>
                                   </tr>
                           ))}
                           <tr>
                              <td></td>
                               <td></td>
                               <td>{numberWithCommas(total)} VND</td>
                           </tr>
                           </tbody>
                       </Table>
                       )}

                       <h4>Reclaimer: Make sure that you had planned accordingly to fully enjoy every locations.</h4>
                       <h4>Although we can provide free postponement, but your experiences is very important to us.</h4>
                   </Box>

                   {!!cartProducts?.length && (
                       <Box>
                           <h2>Fast address information</h2>
                           <Input type="text" placeholder={"Your full name"}/>
                           <Input type="text" placeholder={"Gender, as Male or Female"}/>
                           <Input type="text" placeholder={"Phone number"}/>
                           <Input type="text" placeholder={"Email"}/>
                           <Input type="text" placeholder={"Address"}/>
                           <Button block black>Continue to payment section</Button>
                       </Box>
                   )}


               </ColumnsWrapper>
           </CenterModifier>

        </>
   );
}