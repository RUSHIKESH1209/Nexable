import { createContext } from "react";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {


    const value = {

    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;