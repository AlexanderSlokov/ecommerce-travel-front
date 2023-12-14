import Header from "@/components/Header";
import CenterModifier from "@/components/CenterModifier";
import Title from "@/components/Title";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";


const CategoryHeader  = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  h1{
    font-size: 1.5rem;
  }
`;

const FilterWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color: #444;
  select{
    background-color: transparent;
    border: 0;
    //font-size: inherit;
    color: #444;
  }
  
`;

export default function CategoryPage({ category, subCategories, products: originalProducts }) {
    const [products, setProducts] = useState(originalProducts);
    const defaultFilterValues = category.properties.map(p => (
        { name: p.name, value: 'all' }
    ));
    const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
    const defaultSorting = '_id-desc';
    const [sort, setSort] = useState(defaultSorting);
    // UseState for Spinner
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [filtersChanged, setFiltersChanged] = useState(false);

    function handleFilterChange(filterName, filterValue) {
        setFiltersValues(prev => {
            return prev.map(p => ({
               name: p.name,
               value: p.name === filterName ? filterValue: p.value,

            }));
        });
        setFiltersChanged(true);
    }

    useEffect(() => {

        setLoadingProducts(true);

        const catIds = [category._id, ...(subCategories?.map(c => c._id) || [] )];
        const params = new URLSearchParams;

        params.set('categories', catIds.join(','));
        params.set('sort', sort);

        filtersValues.forEach(f => {
            if (f.value !== 'all') {
                params.set(f.name, f.value);
            }
        });

        const url = `/api/products?` + params.toString();
        axios.get(url)
            .then(res => {
                setProducts(res.data); // You need to update the products state with the response
                setLoadingProducts(false);

            })
            .catch(error => {
                // Handle errors here, for example, log them or display a message
                console.error('Failed to fetch products:', error);
            });

    }, [filtersValues, category._id, subCategories, sort, filtersChanged]);


    return(
        <>
            <Header/>
            <CenterModifier>
                <CategoryHeader>
                    <Title>{category.name}</Title>
                        <FilterWrapper>
                            {category.properties.map(prop => (
                                <Filter key={prop.name}>
                                    <span>{prop.name}:</span>
                                    <select
                                        onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                                        value={filtersValues?.find(f => f.name === prop.name).value}>
                                        <option value="all">All</option>
                                        {prop.values.map( values => (
                                            <option key={values} value={values}>{values}</option>
                                        ))}
                                    </select>
                                </Filter>
                            ))}
                            <Filter>
                                <span>Sort:</span>
                                <select
                                    value={sort}
                                    onChange={ev => {
                                        setSort(ev.target.value);
                                        setFiltersChanged(true);
                                    }}>
                                    <option value={"price-asc"}>Price, lowest first</option>
                                    <option value={"price-desc"}>Price, highest first</option>
                                    <option value="_id-desc">Newest first</option>
                                    <option value="_id-asc">Oldest first</option>
                                </select>

                            </Filter>
                        </FilterWrapper>
                </CategoryHeader>
                {loadingProducts && (
                    <Spinner fullWidth/>
                )}
                {!loadingProducts && (
                    <div>
                        {products.length > 0 && (
                            <ProductsGrid products={products}/>
                        )}
                        {products.length === 0 && (
                            <div>Sorry, No tours suit your requirements found</div>
                        )}
                    </div>

                )}

            </CenterModifier>
        </>
    );
}

export async function getServerSideProps(context) {
    // Make sure to handle errors or invalid IDs in your database queries
    try {
        const category = await Category.findById(context.query.id);
        if (!category) {
            // Handle the case where the category is not found
            return { notFound: true };
        }
        const subCategories = await Category.find({ parent: category._id });
        const catIds = [category._id, ...subCategories.map(c => c._id)];
        const products = await Product.find({ category:catIds }); // Use $in operator to search for multiple IDs

        return {
            props: {
                category: JSON.parse(JSON.stringify(category)),
                subCategories: JSON.parse(JSON.stringify(subCategories)),
                products: JSON.parse(JSON.stringify(products)),
            }
        };
    } catch (error) {
        // Handle the error properly
        console.error('Error in getServerSideProps:', error);
        return { notFound: true };
    }
}