
import Link from "next/link";
import styled from "styled-components";
import CenterModifier from "@/components/CenterModifier";
import {useContext, useState} from "react";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcon";

const StyledHeader = styled.header`
    background-color: #01051e;
`;

const StyledNav = styled.nav`
  ${props => props.mobileNavigationActive? `
    display: block;
  ` : `
    display: none;
  `}

  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;

  background-color: #01051e;
  
      @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
      }
`;

const Logo = styled(Link)`
  color: azure;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  display: block;
  color: azure;
  text-decoration: none;
  padding: 10px 0;
  min-width: 30px;
  svg{
    height: 20px;
  }
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: azure;
  cursor: pointer;
  
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
 display: flex;
  align-items: center;
  a{
    display: inline-block;
    min-width: 20px ;
    color: azure;
    svg{
      width: 14px;
      height: 14px;
    }
  }
`;

export default function Header() {
    const {cartProducts} = useContext(CartContext);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
return (
    <StyledHeader>
        <CenterModifier>
            <Wrapper>
                <Logo href={'/'}>Tour de Flare</Logo>

                <StyledNav mobileNavigationActive={mobileNavigationActive}>
                    {/*Link for our homepage, so this has only slash*/}
                    <NavLink href={'/'}>Home</NavLink>
                    <NavLink href={'/products'}>All products</NavLink>
                    <NavLink href={'/categories'}>Categories</NavLink>
                    <NavLink href={'/account'}>Account</NavLink>
                    <NavLink href={'/cart'}>Your plan({cartProducts.length})</NavLink>
                </StyledNav>
                <SideIcons>
                    <Link href={'/search'}><SearchIcon/></Link>
                    <NavButton onClick={() => setMobileNavigationActive(prev => !prev)}>
                        <BarsIcon/>
                    </NavButton>
                </SideIcons>
            </Wrapper>
        </CenterModifier>
    </StyledHeader>
);
}