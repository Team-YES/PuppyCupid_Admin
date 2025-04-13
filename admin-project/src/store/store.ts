import { configureStore, createSlice } from "@reduxjs/toolkit";
import getUserInfoReducer from "@/reducers/getUserInfo";
import getReportsReducer from "@/reducers/getAdminReports";

export const store = configureStore({
  reducer: {
    adminUsers: getUserInfoReducer,
    adminReports: getReportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
