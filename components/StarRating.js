import StarOutline from "@/components/icons/StarOutline";
import styled from "styled-components";
import {useState} from "react";
import StarSolid from "@/components/icons/StarSolid";

const StarsWrapper = styled.div`
    display: inline-flex;
    gap: 1px;
    position: relative;
    align-items: center;
    
`;

const StarWrapper = styled.button`
    ${props => props.size === 'md' && `
    height: 1.4rem,
    width: 1.4rem,
    `}

    ${props => props.size === 'sm' && `
    height: 1rem,
    width: 1rem,
    `}

    ${props => !props.disabled && `
    cursor: pointer,
    `}
    
    height: 1.4rem;
    width: 1.4rem;
    cursor: pointer;
    padding: 0 ;
    border: 0;
    display: inline-block;
    background-color: transparent;
    color: #395a7f;
`;
export default function StarRating({
    size='md',
        defaultHowMany = 0, disabled, onChange = () => {}
    }) {
    const [howMany, setHowMany] = useState(defaultHowMany);
    const stars= [1,2,3,4,5];

    function handleStarsClick(star) {
        if(disabled) {
            return;
        }
        setHowMany(star);
        onChange(star);
    }

    return(
        <StarsWrapper>
            {stars.map(star => (
                <>
                    <StarWrapper disabled={disabled}
                                 size={size}
                                 onClick={() => handleStarsClick(star)}>
                        {howMany >= star ? <StarSolid/> : <StarOutline/>}
                    </StarWrapper>
                </>
            ))}
        </StarsWrapper>
    );
}