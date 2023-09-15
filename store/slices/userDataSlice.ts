import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";

const userSlice = createSlice({
  name: "user",
  initialState: null as UserState | null,
  reducers: {
    signIn: (state: UserState | null, action: PayloadAction<UserState>) => {
      state = action.payload;
      return state;
    },
    signOut: () => {
      return null;
    }
  }
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;