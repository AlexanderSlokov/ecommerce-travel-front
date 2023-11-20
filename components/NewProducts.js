import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import ProductBox from "@/components/ProductBox";


const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding-top: 20px;
`;
export default function NewProducts({products}) {
    return (
        <CenterModifier>
            <ProductGrid>
                {products?.length > 0 && products.map(product => (
                   <ProductBox {...product}/>
                ))}
            </ProductGrid>
        </CenterModifier>

    );
}