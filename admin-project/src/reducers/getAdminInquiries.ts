import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface InquiryUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  phone: string;
  provider: string;
  role: string;
  isPhoneVerified: boolean;
  created_at: string;
  power_expired_at: string;
  gender?: string | null;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  content: string;
  type: "service" | "etc" | "bug" | string; // 확장 가능
  status: "pending" | "completed" | "processing" | string;
  created_at: string;
  user: InquiryUser;
}

interface AdminInquiriesState {
  inquiries: Inquiry[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminInquiriesState = {
  inquiries: [],
  loading: false,
  error: null,
};

export const getAdminInquiries = createAsyncThunk<Inquiry[]>(
  "adminInquiries/getAdminInquiries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/admin/inquiries");
      // console.log("문의 reducer", res.data.inquiries);
      return res.data.inquiries;
    } catch (error: any) {
      console.error("문의 목록 요청 실패:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminInquiriesSlice = createSlice({
  name: "adminInquiries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(getAdminInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminInquiriesSlice.reducer;
