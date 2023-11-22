import Header from "@/components/Header";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";


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


function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CartPage() {
    const {cartProducts} = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(cartProducts.length > 0 ) {
            axios.post('/api/cart', {ids:cartProducts}).then(response => {
                setProducts(response.data);
            })
        }
    }, [cartProducts]);



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
                       {products?.length > 0 && (
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
                                       </ProductInfoCell>
                                       <td align={"center"}>{cartProducts.filter(id => id === product._id).length}</td>
                                       <td>{numberWithCommas(cartProducts.filter(id => id === product._id).length * product.price)} VND</td>
                                   </tr>
                           ))}
                           </tbody>
                       </Table>
                       )}
                   </Box>

                   {!!cartProducts?.length && (
                       <Box>
                           <h2>Fast booking information</h2>
                           <input type="text" placeholder={"Address 1"}/>
                           <input type="text" placeholder={"Address 2"}/>
                           <Button block black>Continue to payment section</Button>
                       </Box>
                   )}


               </ColumnsWrapper>
           </CenterModifier>

        </>
   );
}