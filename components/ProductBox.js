import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link"
import {useContext, useState} from "react";
import {CartContext} from "@/components/CartContext";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import axios from "axios";


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
  position: relative;
  img {
    max-width: 100%;
    max-height: 100px;
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

const WishlistButton = styled.button`
  border: 0;
  width: 20px;
  height: 20px;
  top: 0;
  right: 0;
  
  position: absolute;
  background: transparent;
  
  ${props => props.wished ? `
    color: red;
  ` : `
    color: black;
  `}
  
  svg{
    width: 16px;
  }
  cursor: pointer;
`;

export function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProductBox({_id, title,description,destination,
                                   price, startDate, endDate, capacity,
                                       images, category, properties,
                                       wished = false}) {

    const url = '/product/' + _id;
    const {addProduct, checkForOverlappingTours} = useContext(CartContext);
    const [isWished,setIsWished] = useState(wished);

    const moreOfThisProduct = (newProductId) => {
        // Call checkForOverlappingTours here and handle the logic based on its return value
        if (checkForOverlappingTours(newProductId)) {
            alert('This tour overlaps with another in your cart!');
        } else {
            addProduct(newProductId); // Add product to cart if no overlap
        }
    }

    function addToWishList(ev) {
        // Stop the irrelevant event of navigating to the single product page
        ev.preventDefault();
        ev.stopPropagation();
        const nextValue = !isWished;
        // call out the api
        axios.post('/api/wishlist', {
            product:_id,
        }).then(() => {});
        setIsWished(nextValue);
    }

    return(
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <WishlistButton wished={isWished} onClick={addToWishList}>
                        {isWished ? <HeartSolidIcon/> : <HeartOutlineIcon/>}
                    </WishlistButton>

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