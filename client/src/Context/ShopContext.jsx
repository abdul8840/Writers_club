import React, { createContext } from "react";
import new_collection from "../assets/new_collection.js";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const contextValue = { products: new_collection };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
