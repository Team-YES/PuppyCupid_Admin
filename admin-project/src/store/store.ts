import { configureStore, createSlice } from "@reduxjs/toolkit";
import getUserInfoReducer from "@/reducers/getUserInfo";

export const store = configureStore({
  reducer: {
    adminUsers: getUserInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
