import styled from "styled-components";
import Button from "@/components/Button";


const ProductWrapper  = styled.div`

`;

const Title = styled.h2`
  font-weight: normal;
  font-size: .9rem;
  margin: 0;
`;

const WhiteBox = styled.div`
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
  font-weight: bold;
`;

function numberWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProductBox({_id, title,description,destination,
                                   price, startDate, endDate, capacity, images,
                                   category, properties}) {

    return(
        <ProductWrapper>
            <WhiteBox>
                <div>
                    <img src={images[0]} alt=""/>
                </div>
            </WhiteBox>

            <ProductInfoBox>
                <Title>{title}</Title>
                <PriceRow>
                    <Price>
                        VND {numberWithCommas(price)}
                    </Price>

                    <div>
                        <Button primary outline>Explore</Button>
                    </div>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>

    );
}