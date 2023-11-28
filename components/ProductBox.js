import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link"
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";

const ProductWrapper  = styled.div`

`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: .9rem;
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
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1rem;
  font-weight: 500;
`;

function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProductBox({_id, title,description,destination,
                                   price, startDate, endDate, capacity, images,
                                   category, properties}) {

    const url = '/product/' + _id;
    const {addProduct, cartProducts} = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products') // This endpoint should return all products
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []); // Empty dependency array means this runs once on mount

    function checkForOverlappingTours(newProductId) {
        if (!products) {
            console.error('Products data is not loaded yet.');
            return false; // Or you might want to handle this case differently
        }

        const newProduct = products.find(p => p._id === newProductId);
        if (!newProduct) {
            console.error(`Product with ID ${newProductId} not found.`);
            return false; // Product not found in the products array
        }

        const newProductStartDate = new Date(newProduct.startDate);
        const newProductEndDate = new Date(newProduct.endDate);

        for (const productId of cartProducts) {
            const existingProduct = products.find(p => p._id === productId);
            const existingProductStartDate = new Date(existingProduct.startDate);
            const existingProductEndDate = new Date(existingProduct.endDate);

            if (newProductStartDate <= existingProductEndDate && newProductEndDate >= existingProductStartDate) {
                return true; // There is an overlap
            }
        }
        return false; // No overlaps
    }

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

                    <div>
                        <Button primary outline
                        onClick={() => moreOfThisProduct(_id) }
                        >Add a slot</Button>
                    </div>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>

    );
}