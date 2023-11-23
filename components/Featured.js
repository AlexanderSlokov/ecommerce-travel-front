import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/Cart";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import {set} from "mongoose";

const BackGround = styled.div`
    background-color: #01051e;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
  font-size: 2.5rem;
`;

const Desc =  styled.p`
    color: #e1e7f6;
    font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: 40px;
    
    img{
      max-width: 100%;
    }
  
    div{
      align-items: center;
    }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({product}) {
    const {addProduct} = useContext(CartContext);

    function addFeaturedToCart () {
        addProduct(product._id);

    }

    return(
        <BackGround>
            <CenterModifier>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <h2>On the spotlight of this month:</h2>
                            <Title> {product.title}</Title>

                            <Desc>
                                {product.description}
                            </Desc>

                            <ButtonsWrapper>
                                <ButtonLink href = {'/products/' + product._id} outline={1} white={1}>Find out more</ButtonLink>
                                <Button white onClick={addFeaturedToCart}>
                                    <CartIcon/>
                                    Add this to your plan!
                                </Button>
                            </ButtonsWrapper>

                        </div>
                    </Column>

                    {/*This div is for image*/}
                    <Column>
                        <img src="https://images.toplist.vn/images/800px/dao-phu-quoc-761235.jpg" alt=""/>
                    </Column>
                </ColumnsWrapper>
            </CenterModifier>
        </BackGround>
    );
}