import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx';

const Product = () => {
    const context = useContext(ShopContext);
    const { productId } = useParams();

    // Handle null context
    if (!context || !context.new_collections) {
        return <div>Loading...</div>; // or any other fallback UI
    }

    // Destructure new_collections from context
    const { new_collections } = context;

    // Find the product with the matching productId
    const product = new_collections.find((product) => product.id === Number(productId));

    if (!product) {
        return <div>Product not found!</div>;
    }

    return (
        <div>
            <ProductDisplay product={product} />
        </div>
    );
};

export default Product;
