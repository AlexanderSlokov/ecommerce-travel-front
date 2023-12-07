import Title from "@/components/Title";
import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import styled from "styled-components";
import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";
import {mongooseConnect} from "@/lib/mongoose";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr ;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  a{
    color: cornflowerblue;
  }
`;

const CategoryWrapper = styled.div`
 margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: skyblue;
  height: 160px;
  border-radius: 10px;
  align-items: center;
  display: flex;  
  justify-content: center;
  color: royalblue;
  text-decoration: none;
  
`;
export default function CategoriesPage({mainCategories, categoriesProducts, wishedProducts}) {
    return (
        <>
            <Header/>
            <CenterModifier>
                {mainCategories.map(cat => (
                    <CategoryWrapper>
                        <CategoryTitle>
                            <h2> {cat.name} </h2>
                            <div>
                                <Link href={'/category/' + cat._id}>Show all</Link>
                            </div>
                        </CategoryTitle>
                        <CategoryGrid>
                            {categoriesProducts[cat._id].map(p => (
                                <div>
                                    <ProductBox
                                        {...p}
                                        wished={wishedProducts?.includes(p._id)}
                                    />
                                </div>
                            ))}

                            <ShowAllSquare href={'/category/' + cat._id}>
                                Show all &rarr;
                            </ShowAllSquare>
                        </CategoryGrid>
                    </CategoryWrapper>
                ))}
                <Title>All categories</Title>
            </CenterModifier>
        </>
    )
}

export async function getServerSideProps(ctx) {

    await mongooseConnect();

    const categories = await Category.find();
    const mainCategories = categories.filter(c => !c.parent);
    const categoriesProducts = {};
    const allFetchedProductsID = [];

    for (const mainCat of mainCategories ) {

        const mainCatId = mainCat._id.toString();

        const childCatIds = categories
            .filter(c => c?.parent?.toString() === mainCatId)
            .map(c => c._id.toString() )

        const categoriesIds = [mainCatId, ...childCatIds];
        const products = await Product.find(
            {category: categoriesIds},
            null,
            {limit: 3, sort: {'_id': -1}
            });
        categoriesProducts[mainCatId] = products;
        allFetchedProductsID.push(...products.map(p => p._id.toString()));
    }

    // For the wishlist, as the same with other pages
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const wishedProducts = session?.user
        ? await WishedProduct.find({
        userEmail:session?.user.email,
        product: allFetchedProductsID,
    }) : [];

    return{
        props: {
            mainCategories: JSON.parse(
                JSON.stringify(mainCategories)
            ),

            categoriesProducts: JSON.parse(
                JSON.stringify(categoriesProducts),
            ),

            wishedProducts: wishedProducts.map(item =>
                item.product.toString()),
        }
    }
}