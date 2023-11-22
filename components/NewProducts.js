import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import ProductBox from "@/components/ProductBox";


const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  margin: 30px 0 20px;
`;
export default function NewProducts({products}) {
    return (
        <CenterModifier>
            <Title>Best-selling tours</Title>
            <ProductGrid>
                {products?.length > 0 && products.map(product => (
                   <ProductBox {...product}/>
                ))}
            </ProductGrid>
        </CenterModifier>

    );
}