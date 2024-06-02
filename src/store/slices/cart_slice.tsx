import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Product from "@/types/Product";
import products_list, { productCategories } from "@/data/products_list";
import { Order } from "@/types/Order";
import { CartItem } from "@/types/Cart_Item";

export type TranslatedCartItem = {
    translatedTitle: string;
    value: number;
    quantity: number;
};

type CartState = {
    cartItems: CartItem[];
    cartTotal: number;
    checkoutOrder: Order[];
};

const initialCartState: CartState = {
    cartItems: [],
    cartTotal: 0,
    checkoutOrder: [],
};

type AddCartItemAction = PayloadAction<{ product: Product }>;
type RemoveCartItemAction = PayloadAction<{ product: Product }>;
type DecrementCartItemAction = PayloadAction<{ product: Product }>;

export const findProductByID = (search_id: string, products: Product[]): Product | undefined => {
    for (const prod of products) {
        const matchingProduct = products.find((product) => product.id === search_id);
        if (matchingProduct) return matchingProduct;
    }

    return undefined;
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addCartItem: (state, action: AddCartItemAction) => {
            const { product } = action.payload;
            const product_exists_in_cart = state.cartItems.find(
                (item) => item.product.id === product.id && (item.product.variant.id === product.variant.id || product.variant.id === "default")
            );

            if (product_exists_in_cart) {
                product_exists_in_cart.quantity += 1;
            } else {
                const product_available = findProductByID(product.id, products_list);

                if (product_available) {
                    state.cartItems.push({
                        product: product,
                        quantity: 1,
                    });
                }
            }

            state.cartTotal = state.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },
        decrementCartItem: (state, action: DecrementCartItemAction) => {
            const { product } = action.payload;
            const product_exists_in_cart = state.cartItems.find(
                (item) => item.product.id === product.id && (item.product.variant.id === product.variant.id || product.variant.id === "default")
            );

            if (product_exists_in_cart) {
                product_exists_in_cart.quantity -= 1;
                if (product_exists_in_cart.quantity <= 0) {
                    state.cartItems = state.cartItems.filter(
                        (item) => item.product.id !== product.id || item.product.variant.id !== product.variant.id
                    );
                }
            }

            state.cartTotal = state.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },
        removeCartItem: (state, action: RemoveCartItemAction) => {
            const { product } = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.product.id !== product.id || item.product.variant.id !== product.variant.id);
            state.cartTotal = state.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.cartTotal = 0;
        },
        setCheckoutOrder: (state, action: PayloadAction<Order[]>) => {
            state.checkoutOrder = action.payload;
        },
    },
});

export const { addCartItem, decrementCartItem, removeCartItem, setCheckoutOrder, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
