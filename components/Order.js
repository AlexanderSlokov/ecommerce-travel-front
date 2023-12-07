import styled from "styled-components";

const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
  align-items: center;
  time{
    font-size: 1rem;
    color: cadetblue;
  }
`;

const ProductRow = styled.div` 
    span{
      color: dodgerblue;
    }
`;

const AccountInfo = styled.div`
  font-size: .8rem;
  line-height: 1rem;
  margin-top: 10px;
  color: darkslategray;
`;

export default function SingleOrder({line_items, createdAt, ...rest}) {
    return (
        <StyledOrder>
            <div>
                <time>{(new Date(createdAt)).toLocaleString('sv-SE')}</time>
            </div>

            <AccountInfo>
                {rest.name} <br/>
                {rest.email} <br/>
                {rest.phoneNumber} <br/>
                {rest.pickUpAddress}
            </AccountInfo>
            <div>
                {line_items.map(item => (
                    <ProductRow>
                        <span> {item.quantity} slot(s) for </span>
                        {item.price_data.product_data.name}
                    </ProductRow>
                ))}
            </div>

        </StyledOrder>
    );
}