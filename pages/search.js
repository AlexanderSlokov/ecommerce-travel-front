import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import styled from "styled-components";
import Input from "@/components/Input";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const SearchInput =  styled(Input)`
    padding: 5px 10px;
  border-radius: 5px;
  margin: 30px 0 30px;
  font-size: 1.4rem;
`;
export default function SearchPage() {
    const [searchPhrase, setSearchPhrase] = useState('');

    useEffect(() => {
        if (searchPhrase.length > 0) {
            axios.get('/api/products?phrase='+encodeURIComponent(searchPhrase)).then(r => {
                console.log(r.data);
            })
        }
    }, [searchPhrase]);
    return(
        <>
        <Header/>
            <CenterModifier>
                <SearchInput
                    autoFocus
                    onChange = {ev => setSearchPhrase(ev.target.value)}
                    placeholder={"Search a tour..."}/>
            </CenterModifier>
        </>
    )
}