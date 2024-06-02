import { configureStore } from "@reduxjs/toolkit";

// import cart from "./slices/cart";
import interface_slice from "./slices/interface_slice";
import user_slice from "./slices/user_slice";

export const store = configureStore({
    reducer: {
        // cart: cart,
        interface: interface_slice,
        user: user_slice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
