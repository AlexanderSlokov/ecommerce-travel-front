import Header from "@/components/Header";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";


const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr .7fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: lightskyblue;
  border-radius: 10px;
  padding: 30px;
`;


export default function CartPage() {
    const {cartProduct} = useContext(CartContext);


    return (
       <>
        <Header/>
           <CenterModifier>
               <ColumnsWrapper>
                   <Box>
                       <h2>You had some ideas here:</h2>
                       {!cartProduct?.length && (
                           <div>
                               <h3>Hmm, nothing selected...</h3>
                               Maybe we can go around and grape some places for our trip first, yes?
                           </div>
                       )}
                   </Box>

                   {!!cartProduct?.length && (
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