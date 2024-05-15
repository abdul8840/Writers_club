import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx';

const Product = () => {
    const context = useContext(ShopContext);
    const { productId } = useParams();

    if (!context) {
        return <div>Loading...</div>;
    }

    const { products } = context;
    const product = products.find((product) => product.id === Number(productId));

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
