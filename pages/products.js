import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";


  

export default function AllProductsPage({products, wishedProducts}) {
    // console.log({products});
    //objs undefined?
    return (
        <>
            <Header/>
            <CenterModifier>
                <Title>All tours</Title>
                <ProductsGrid products={products} wishedProducts={wishedProducts}/>
            </CenterModifier>

        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const products = await Product.find({}, null, {sort: {'_id': -1}});
    const {user} = await getServerSession(ctx.req, ctx.res, authOptions);
    const wishedProducts = await WishedProduct.find({
        userEmail:user.email,
        product: products.map(p => p._id.toString()),
    })
    // console.log({products});
    // log return: null projection
    return {props:{
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map( item => item.product.toString()),

        }};
}