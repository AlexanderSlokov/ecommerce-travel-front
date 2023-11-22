import {createContext, useEffect, useState} from "react";



export const CartContext = createContext({});

export function CartContextProvider({children}) {

    const ls = typeof window !== "undefined" ? window.localStorage:null;
    const[cartProducts, setCartProducts] = useState([]);

    // Stop cart to lost counting when reload the pages or directing
    useEffect(() => {
        // Any products in there yet?
        if(cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts));
        }
    }, [cartProducts]);

    useEffect(() => {
        if(ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);

    // Count how many products added
    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId])
    }


    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct}}>
            {children}
        </CartContext.Provider>
    );
}