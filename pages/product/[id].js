import CenterModifier from "@/components/CenterModifier";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/Cart";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import {numberWithCommas} from "@/components/ProductBox";
import ProductReviews from "@/components/ProductReviews";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
  
`;

const PriceRow = styled.div`
  gap: 20px;
  display: flex;
  align-items: center;
  margin-top: 40px;
  
`;

const Price = styled.span`
font-size: 1.4rem;
`;

export default function SingleProductPage({product}) {
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
        <>
            <Header/>
            <CenterModifier>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images}/>
                    </WhiteBox>

                    <div>
                        <Title>{product.title}</Title>
                        <p> Description: {product.description}</p>

                        <div> From: {
                            new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                .format(new Date(product.startDate))
                        } to {
                            new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                .format(new Date(product.endDate))
                        }</div>

                        <PriceRow>
                            <div>
                                <Price> {numberWithCommas(product.price)} USD (per a slot)</Price>

                            </div>
                            <div>
                                <Button primary onClick={() => moreOfThisProduct(product._id)}

                                ><CartIcon/> Add a slot for this tour</Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
                <ProductReviews product={product}/>
            </CenterModifier>
        </>
    );
}

export async function getServerSideProps(context) {
    // console.log({query:context.query});
    // { query: { id: '655b31a10c4b2b252dedb308' } }
    await mongooseConnect();
    const {id} = context.query;
    const product = await Product.findById(id);

    return {
        props: {
            //a product?
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}
