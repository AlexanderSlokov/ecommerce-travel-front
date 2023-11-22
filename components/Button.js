import styled from "styled-components";
import {css} from "styled-components";
import {primary} from "@/lib/colors";

export const ButtonStyle = css `
  
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  
  svg {
    height: 16px;
    margin-right: 5px;
  }
  
  ${props => props.block && css`
    display: block;
    width: 100%;
  `};

  ${props => props.white && !props.outline && css `
    background-color: #fff;
    color: #01051e;
  `}

  ${props => props.white && props.outline && css `
    background-color: transparent;
    color: #fff;;
    border: 1px solid #fff;
  `}

  ${props => props.black && !props.outline && css `
    background-color: #000;
    color: #fff;
  `}

  ${props => props.black && props.outline && css `
    background-color: transparent;
    color: #000;;
    border: 1px solid #000;
  `}
  
  ${props => props.primary && !props.outline && css`
    background-color: ${primary};
    border: 1px solid ${primary};
    color: azure;
    
  `}

  ${props => props.primary && props.outline && css`
    background-color: transparent;
    color: ${primary};
    border: 1px solid ${primary};
  `}

  ${props => props.size === 'l' && css`
    font-size: 1.2rem;
    padding: 10px 20px;
    svg{
      height: 20px;
    }
  `};
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({children, ...rest}) {
    return(
        <StyledButton {...rest}>
          {children}
        </StyledButton>
    );
}