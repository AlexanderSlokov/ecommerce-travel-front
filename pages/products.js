import Header from "@/components/Header";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";

// Session for styled components
const Title = styled.h1`
  font-size: 1.5rem;
  
`;
export default function AllProductsPage({products}) {
    // console.log({products});
    //objs undefined?
    return (
        <>
            <Header/>
            <CenterModifier>
                <Title>All tours</Title>
                <ProductsGrid products={products}/>
            </CenterModifier>

        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, {sort: {'_id': -1}});
    // console.log({products});
    // log return: null projection
    return {props:{
            products: JSON.parse(JSON.stringify(products)),

        }};
}