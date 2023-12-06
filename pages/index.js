import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import {WishedProduct} from "@/models/WishedProduct";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";


export default function HomePage({featuredProduct, newProducts, wishedNewProducts}) {
  return(
      <div>
       <Header/>
       <Featured product={featuredProduct}/>
      <NewProducts products = {newProducts} wishedProducts={wishedNewProducts}/>
      </div>
  )
}

export async function getServerSideProps(ctx) {
    const featuredProductId = '655b31a10c4b2b252dedb308';
    await mongooseConnect();
    const featuredProduct = await Product.findById(featuredProductId);

    // Find new products, descended order, only 10 products appear
    const newProducts = await Product.find({}, null, {sort:{'_id':-1}, limit:10});

    // FInd if any products wished in wishlist?
    const {user} = await getServerSession(ctx.req, ctx.res, authOptions);
    const wishedNewProducts = await WishedProduct.find({
        userEmail:user.email,
        product: newProducts.map(p => p._id.toString()),
    })
    // console.log(wishedNewProducts);

    return {
        props: {
            featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts: wishedNewProducts.map( item => item.product.toString()),
        },
    }
}