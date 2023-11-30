import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link"
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";


const ProductWrapper  = styled.div`

`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 100%;
    max-height: 100%;
  };
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px){
    display: flex;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  gap: 50px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px){
    font-size: 1rem;
    font-weight: 500;
    text-align: left;
  }
`;

export function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProductBox({_id, title,description,destination,
                                   price, startDate, endDate, capacity, images,
                                   category, properties}) {

    const url = '/product/' + _id;
    const {addProduct, checkForOverlappingTours} = useContext(CartContext);

    const moreOfThisProduct = (newProductId) => {
        // Call checkForOverlappingTours here and handle the logic based on its return value
        if (checkForOverlappingTours(newProductId)) {
            alert('This tour overlaps with another in your cart!');
        } else {
            addProduct(newProductId); // Add product to cart if no overlap
        }
    }

    return(
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <img src={images?.[0]} alt=""/>
                </div>
            </WhiteBox>

            <ProductInfoBox>
                <Title href={''}>{title}</Title>
                <PriceRow>
                    <Price>
                         {numberWithCommas(price)} USD (per slot)
                    </Price>

                    <div> From: {
                        new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                            .format(new Date(startDate))
                    } to {
                        new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                            .format(new Date(endDate))
                    }</div>

                    <div>
                        <Button primary outline block
                        onClick={() => moreOfThisProduct(_id)}
                        >Add a slot</Button>
                    </div>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>

    );
}