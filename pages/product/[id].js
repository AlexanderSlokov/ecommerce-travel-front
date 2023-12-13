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
        grid-template-columns: .8fr 1.2fr; /* Or adjust the ratio as needed */
    }
    gap: 10px; /* Adjust the gap if more space is needed */
    margin: 10px 0 10px;

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

    async function moreOfThisProduct(newProductId) {
        // Await the result from checkForOverlappingTours
        const isOverlapping = await checkForOverlappingTours(newProductId);

        if (!isOverlapping) {
            // Add product to cart if no overlap
            addProduct(newProductId);
        }
        // If there is an overlap, checkForOverlappingTours will handle showing the alert.
    }

    const renderProductProperties = (properties) => {
        // Convert the properties' object into an array of key-value pairs
        const entries = Object.entries(properties || {});
        // Generate JSX for each property
        return entries.map(([key, value], index) => {
            // If the value is truthy or a number (to allow zeros), render the property
            if (value || typeof value === 'number') {
                return (
                    <div key={index}>
                        <strong>{key.replace(/_/g, ' ')}:</strong> {value.toString()}
                    </div>
                );
            }
            return null; // Otherwise, don't render anything
        });
    };

    return (
        <>
            <Header/>
            <CenterModifier>
                <WhiteBox>
                    <ProductImages images={product.images}/>
                </WhiteBox>
                <ColWrapper>
                    <WhiteBox>
                        <div> From: {
                            new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit'})
                                .format(new Date(product.startDate))
                        } to {
                            new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit'})
                                .format(new Date(product.endDate))
                        }</div>

                        <PriceRow>
                            <div>
                                <Price> {numberWithCommas(product.price)} USD (per a slot)</Price>
                            </div>
                            <div>
                                <Button primary onClick={() => moreOfThisProduct(product._id)}>
                                    <CartIcon/> Add a slot for this tour
                                </Button>
                            </div>
                        </PriceRow>

                        <WhiteBox className="ReviewsBox">
                            <ProductReviews product={product}/>
                        </WhiteBox>

                    </WhiteBox>
                    <div>

                        <WhiteBox>
                            <Title>{product.title}</Title>
                            {/* Dynamically display product properties */}
                            <div>
                                {renderProductProperties(product.properties)}
                            </div>
                        </WhiteBox>


                        <WhiteBox>
                            <p><strong>Description:</strong></p>
                            <div style={{whiteSpace: 'pre-wrap'}}>{product.description}</div>
                        </WhiteBox>

                    </div>
                </ColWrapper>
            </CenterModifier>
        </>
    );
}

export async function getServerSideProps(context) {
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
