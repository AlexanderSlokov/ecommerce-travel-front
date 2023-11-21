import styled from "styled-components";

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
            <Title>{title}</Title>

        </ProductWrapper>

    );
}