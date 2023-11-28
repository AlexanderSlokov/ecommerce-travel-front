import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";


  

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