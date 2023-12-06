import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import styled from "styled-components";
import Input from "@/components/Input";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import {debounce} from "lodash/function";
import Spinner from "@/components/Spinner";

const SearchInput =  styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
`;

const InputWrapper = styled.div`
  position: sticky;
  top: 70px;
  margin: 25px;
  padding: 5px 0;
  

`;
export default function SearchPage() {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [products, setProducts]= useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearch = useCallback(
        debounce(searchProducts, 500), []
    );

    useEffect(() => {
        if (searchPhrase.length > 0) {
            setIsLoading(true);
            debouncedSearch(searchPhrase);
        } else {
            setProducts([]);
        }
    }, [searchPhrase]);

    function searchProducts (searchPhrase) {
        axios.get('/api/products?phrase='+encodeURIComponent(searchPhrase)).then(r => {
            setProducts(r.data);
            setIsLoading(false);
        })
    }
    return(
        <>
        <Header/>
            <CenterModifier>

                <InputWrapper>
                    <SearchInput
                        autoFocus
                        onChange = {ev => setSearchPhrase(ev.target.value)}
                        placeholder={"Search a tour..."}/>
                </InputWrapper>

                <div>Found {products.length} tour(s).</div>

                {!isLoading && searchPhrase !== '' && products.length === 0 && (
                    <h2>No tour found for query "{searchPhrase}"</h2>
                )}

                {isLoading && (
                    <Spinner fullWidth={true}/>
                )}

                {!isLoading && products.length > 0 && (
                    <ProductsGrid products = {products}/>
                )}
            </CenterModifier>
        </>
    )
}