import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/Cart";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";


const BackGround = styled.div`
    background-color: #01051e;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.25rem;
  @media screen and (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Desc =  styled.p`
    color: #e1e7f6;
    font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
    
    img{
      max-width: 100%;
      max-height: 300px;
      display: block;
      margin: 0 auto;
    }
  
  div:nth-child(1){
    order: 2;
      margin-left: auto;
      margin-right: auto;
  }
  
    @media screen and (min-width: 768px) {
      grid-template-columns: 1.1fr .9fr;
        & > div:nth-child(1){
            order: 0;
        }
      img{
        max-width: 100%;
      }
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

const CenterImg = styled.div`
    display: flex;  
    align-items: center;    
    justify-content: center;
`;

const ImgColumn = styled.div`
    & > div {
        width: 100% ;
    }
`;

const ContentWrapper = styled.div`
    * {
        text-align: center;
    }
`;


export default function Featured({product}) {
    const {addProduct, checkForOverlappingTours} = useContext(CartContext);

    async function moreOfThisProduct(newProductId) {
        // Await the result from checkForOverlappingTours
        const isOverlapping = await checkForOverlappingTours(newProductId);

        if (!isOverlapping) {
            // Add product to cart if no overlap
            addProduct(newProductId);
        }
        // If there is an overlap, checkForOverlappingTours will handle showing the alert.
    }

    return(
        <BackGround>
            <CenterModifier>
                <ColumnsWrapper>
                    <Column>
                        <ContentWrapper>
                            <h2>On the spotlight of this month:</h2>
                            <Title> {product.title}</Title>

                            <Desc>{product.destination}</Desc>

                            <ButtonsWrapper>
                                <ButtonLink href = {'/products/' + product._id} outline={1} white={1}>Find out more</ButtonLink>
                                <Button white onClick={() => moreOfThisProduct(product._id)}>
                                    <CartIcon/>
                                    Add this to your plan!
                                </Button>
                            </ButtonsWrapper>

                        </ContentWrapper>
                    </Column>

                    {/*This div is for image*/}
                    <ImgColumn>
                        <CenterImg>
                            <img src={product.images?.[0]} alt=""/>
                        </CenterImg>
                    </ImgColumn>
                </ColumnsWrapper>
            </CenterModifier>
        </BackGround>
    );
}