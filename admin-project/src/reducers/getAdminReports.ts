import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface Report {
  id: number;
  reportType: "post" | "comment" | "user";
  targetId: number;
  reason: string;
  created_at: string;
  reporter: {
    id: number;
    nickName: string;
    email: string;
  };
  targetInfo: {
    commentId?: number;
    content?: number;
    postId?: number;
    nickName: string;
    email: string;
    userId: number;
  };
}

interface AdminReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminReportsState = {
  reports: [],
  loading: false,
  error: null,
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getAdminReports = createAsyncThunk(
  "adminReports/getAdminReports",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}/admin/reports`, {
        withCredentials: true,
      });

      // console.log("신고reducer", res.data);
      return res.data.reports;
    } catch (error: any) {
      console.error("admin report 요청 실패:", error);
      return rejectWithValue(error.res?.data || error.message);
    }
  }
);

const adminReportsSlice = createSlice({
  name: "adminReports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAdminReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminReportsSlice.reducer;
