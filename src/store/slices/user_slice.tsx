import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/User";

type UserState = {
    currentUser: User | null;
    isAdmin: boolean;
};

// Usuário padrão para visitantes não autenticados, creio que deva ser null em vez dele.
const defaultCurrentUser: User = {
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
};

const initialState: UserState = {
    currentUser: null,
    isAdmin: false,
};

type SetCurrentUserAction = PayloadAction<User | null>;
type UpdateOrdersAction = PayloadAction<boolean>;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action: SetCurrentUserAction) => {
            state.currentUser = action.payload;
        },

        setUserIsAdmin: (state, action: PayloadAction<boolean>) => {
            state.isAdmin = action.payload;
        },
    },
});

export const { setCurrentUser, setUserIsAdmin } = userSlice.actions;
export default userSlice.reducer;
