"use client";

import {
    createContext,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";
import { Product } from "../types/product-type";

export type CartType = { [id: number]: [number, Product] };

type CartContextType = {
    cart: CartType;
    setCart: React.Dispatch<
        React.SetStateAction<{ [id: number]: [number, Product] }>
    >;
};

const cartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState({});
    const v = useMemo(() => ({ cart, setCart }), [cart]);

    return <cartContext.Provider value={v}>{children}</cartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
