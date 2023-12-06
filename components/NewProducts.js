import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import ProductsGrid from "@/components/ProductsGrid";

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  margin: 30px 0 20px;
`;
export default function NewProducts({products, wishedProducts}) {
    return (
        <CenterModifier>
            <Title>New tours</Title>
            <ProductsGrid products={products} wishedProducts={wishedProducts}/>
        </CenterModifier>

    );
}