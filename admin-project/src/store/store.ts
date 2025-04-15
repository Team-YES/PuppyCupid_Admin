import { configureStore, createSlice } from "@reduxjs/toolkit";
import getUserInfoReducer from "@/reducers/getUserInfo";
import getReportsReducer from "@/reducers/getAdminReports";
import getInquiriesReducer from "@/reducers/getAdminInquiries";
import getPaymentReducer from "@/reducers/getPayment";
import getAllPostsReducer from "@/reducers/getAllPostsCount";
import deletePostByAdmin from "@/reducers/deletePost";
import deleteCommentByAdmin from "@/reducers/deleteComment";
import blacklistReducer from "@/reducers/getBlackList";

export const store = configureStore({
  reducer: {
    adminUsers: getUserInfoReducer,
    adminReports: getReportsReducer,
    adminInquiries: getInquiriesReducer,
    adminPayment: getPaymentReducer,
    adminAllPosts: getAllPostsReducer,
    adminDeletePost: deletePostByAdmin,
    adminDeleteComment: deleteCommentByAdmin,
    blacklist: blacklistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
