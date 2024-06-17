import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User as User_Local } from "@/types/User";
import { Subscription } from "@/types/Subscription";
import { Order } from "@/types/Order";
import { set } from "firebase/database";

export type User_Firebase = {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
};

type UserState = {
    firebaseUser: User_Firebase | null;
    currentUser: User_Local | null;
    editedCurrentUser: User_Local | null;
    isAdmin: boolean;
    currentUserSubscriptions: Subscription[];
    currentUserOrders: Order[];
};

// Usuário padrão para visitantes não autenticados, creio que deva ser null em vez dele.
const defaultCurrentUser: User_Local = {
    id: "no-id",
    name: "Usuário Anônimo",
    email: "no-email",
    avatar_url: "no-avatar",
    isOwner: false,
    isAdmin: false,
    isEditor: false,
    isSubscriber: false,
    address: {
        street: "no-street",
        number: "no-number",
        city: "no-city",
        state: "no-state",
        complement: "no-complement",
        zip: "no-postal-code",
    },
    telephone: "no-telephone",
    orders: [],
    subscriptions: [],
};

const initialState: UserState = {
    firebaseUser: null,
    currentUser: null,
    editedCurrentUser: null,
    isAdmin: false,
    currentUserSubscriptions: [],
    currentUserOrders: [],
};

type SetFirebaseUserAction = PayloadAction<User_Firebase | null>;
type SetCurrentUserAction = PayloadAction<User_Local | null>;
type SetEditedCurrentUserAction = PayloadAction<User_Local | null>;
type SetCurrentUserSubscriptionsAction = PayloadAction<Subscription[]>;
type SetCurrentUserOrdersAction = PayloadAction<Order[]>;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setFirebaseUser: (state, action: SetFirebaseUserAction) => {
            state.firebaseUser = action.payload;
        },
        setCurrentUser: (state, action: SetCurrentUserAction) => {
            state.currentUser = action.payload;
        },

        setCurrentEditedUser: (state, action: SetEditedCurrentUserAction) => {
            state.editedCurrentUser = action.payload;
        },

        setUserIsAdmin: (state, action: PayloadAction<boolean>) => {
            state.isAdmin = action.payload;
        },
        setCurrentUserSubscriptions: (state, action: SetCurrentUserSubscriptionsAction) => {
            state.currentUserSubscriptions = action.payload;
        },
        setCurrentUserOrders: (state, action: SetCurrentUserOrdersAction) => {
            state.currentUserOrders = action.payload;
        },
    },
});

export const { setFirebaseUser, setCurrentUser, setCurrentEditedUser, setUserIsAdmin, setCurrentUserSubscriptions, setCurrentUserOrders } =
    userSlice.actions;
export default userSlice.reducer;
