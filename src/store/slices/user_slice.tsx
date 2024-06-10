import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User as User_Local } from "@/types/User";

export type User_Firebase = {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
};

type UserState = {
    firebaseUser: User_Firebase | null;
    currentUser: User_Local | null;
    isAdmin: boolean;
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
    isAdmin: false,
};

type SetCurrentUserAction = PayloadAction<User_Local | null>;
type UpdateOrdersAction = PayloadAction<boolean>;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setFirebaseUser: (state, action: PayloadAction<User_Firebase>) => {
            state.firebaseUser = action.payload;
        },
        setCurrentUser: (state, action: SetCurrentUserAction) => {
            state.currentUser = action.payload;
        },

        setUserIsAdmin: (state, action: PayloadAction<boolean>) => {
            state.isAdmin = action.payload;
        },
    },
});

export const { setFirebaseUser, setCurrentUser, setUserIsAdmin } = userSlice.actions;
export default userSlice.reducer;
