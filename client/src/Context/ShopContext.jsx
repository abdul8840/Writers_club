import React, { createContext } from "react";
import new_collections from "../assets/new_collections.js";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const contextValue = {new_collections};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
