import { configureStore, createSlice } from "@reduxjs/toolkit";
import getUserInfoReducer from "@/reducers/getUserInfo";
import getReportsReducer from "@/reducers/getAdminReports";
import getInquiriesReducer from "@/reducers/getAdminInquiries";

export const store = configureStore({
  reducer: {
    adminUsers: getUserInfoReducer,
    adminReports: getReportsReducer,
    admminInquiries: getInquiriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
