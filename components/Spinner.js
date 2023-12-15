import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center; // Centers the spinner horizontally
    align-items: center; // Centers the spinner vertically
    height: 100vh; // Makes the Wrapper take up the full viewport height
    // Add any additional styling you want for the wrapper
`;

const StyledGif = styled.img`
    width: 300px;
    height: auto;
    animation: fadeInOut 5s; // Adjust the time as needed
    background: transparent;
    @keyframes fadeInOut {
        0% { opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

export default function Spinner({ fullWidth }) {
    return (
        <Wrapper fullWidth={fullWidth}>
            <StyledGif src="/output-onlinegiftools.gif" alt="Loading..." />
        </Wrapper>
    );
}
