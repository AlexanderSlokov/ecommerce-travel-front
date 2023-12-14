import {createContext, useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";


export const CartContext = createContext({});

export function CartContextProvider({children}) {

    const ls = typeof window !== "undefined" ? window.localStorage:null;
    const [cartProducts, setCartProducts] = useState([]);
    const [products, setProducts] = useState([]); // Ensure this is populated with the product data
    const [childrenAges, setChildrenAges] = useState([]);

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

    useEffect(() => {
        axios.get('/api/productsForCheckOverLapping') // This endpoint should return all products
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []); // Empty dependency array means this runs once on mount

    async function checkForOverlappingTours(newProductId) {
        if (!products) {
            console.error('Products data is not loaded yet.');
            return false; // Or you might want to handle this case differently
        }

        const newProduct = products.find(p => p._id === newProductId);
        if (!newProduct) {
            console.error(`Product with ID ${newProductId} not found.`);
            return false; // Product not found in the products array
        }

        const newProductStartDate = new Date(newProduct.startDate);
        const newProductEndDate = new Date(newProduct.endDate);

        for (const productId of cartProducts) {
            const existingProduct = products.find(p => p._id === productId);
            const existingProductStartDate = new Date(existingProduct.startDate);
            const existingProductEndDate = new Date(existingProduct.endDate);

            if (newProductStartDate <= existingProductEndDate && newProductEndDate >= existingProductStartDate) {
                await Swal.fire({
                    title: 'Oops!',
                    text: 'This tour overlaps with another tour in your cart.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
                return true; // There is an overlap
            }

            // Check for close durations (less than 2 days apart)
            const dayInMilliseconds = 24 * 60 * 60 * 1000;
            const minGap = 2 * dayInMilliseconds;
            if (Math.abs(existingProductEndDate - newProductStartDate) < minGap ||
                Math.abs(existingProductStartDate - newProductEndDate) < minGap) {
                await Swal.fire({
                    title: 'Warning!',
                    text: 'This tour is scheduled too close to another tour in your cart. Please allow at least a 2-day gap between tours.',
                    icon: 'warning',
                    confirmButtonText: 'Okay'
                });
                return true; // Tours are too close in duration
            }
        }
        return false; // No overlaps
    }

    // Count how many products added
    async function addProduct(productId) {
        // Add product to cart if there are no overlaps
        setCartProducts(prev => [...prev, productId]);
        await Swal.fire({
            title: 'Success!',
            text: 'Tour added.',
            icon: 'success',
            confirmButtonText: 'Okay'
        });
    }

    function removeProduct(productId) {
        //Rewrite the value of this entity
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1 ) {
                return prev.filter((value,index) => index !== pos);
            }
            return prev;
        });
    }

    function clearCart() {
        setCartProducts([]);
    }

    // Function to add a child's age to the context
    const addChildAge = (age) => {
        setChildrenAges((prevAges) => [...prevAges, age]);
    };

    // Function to remove a child's age from the context
    const removeChildAge = (index) => {
        setChildrenAges((prevAges) => prevAges.filter((_, i) => i !== index));
    };

    const calculateChildrenPrice = (ages, adultPrice, discountRate) => {
        return ages.reduce((acc, age) => {
            return acc + (age <= 10 ? adultPrice * discountRate : adultPrice);
        }, 0);
    };

    return (
        <CartContext.Provider value={{cartProducts,
            setCartProducts,
            checkForOverlappingTours,
            clearCart,
            addProduct,
            addChildAge,
            removeChildAge,
            calculateChildrenPrice,
            removeProduct}}>

            {children}
        </CartContext.Provider>
    );
}