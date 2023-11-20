
import Link from "next/link";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";

const StyledHeader = styled.header`
    background-color: #01051e;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
`;
const Logo = styled(Link)`
  color: azure;
  text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  color: azure;
  text-decoration: none;
`;
export default function Header() {
return (
    <StyledHeader>
        <CenterModifier>
            <Wrapper>
                <Logo href={'/'}>TourFlare</Logo>

                <StyledNav>
                    {/*Link for our homepage, so this has only slash*/}
                    <NavLink href={'/'}>Home</NavLink>
                    <NavLink href={'/products'}>All products</NavLink>
                    <NavLink href={'/categories'}>Categories</NavLink>
                    <NavLink href={'/account'}>Account</NavLink>
                    <NavLink href={'/cart'}>Cart(0)</NavLink>
                </StyledNav>

            </Wrapper>
        </CenterModifier>
    </StyledHeader>
);
}