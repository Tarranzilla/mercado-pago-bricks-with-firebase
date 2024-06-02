import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/User";

type UserState = {
    currentUser: User | null;
    isAdmin: boolean;
};

const initialState: UserState = {
    currentUser: null,
    isAdmin: false,
};

type SetCurrentUserAction = PayloadAction<User>;
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
