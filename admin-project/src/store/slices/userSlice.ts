import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  email: string | null;
  password?: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  password: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: number; email: string }>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },
    logoutUser(state) {
      state.id = null;
      state.email = null;
      state.password = null;
    },
  },
});

export const { setUser: setReduxUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
