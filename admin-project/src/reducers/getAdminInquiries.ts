import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

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

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 문의 데이터 받기 thunk
export const getAdminInquiries = createAsyncThunk<Inquiry[]>(
  "adminInquiries/getAdminInquiries",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");

      const res = await axios.get(`${baseURL}/admin/inquiries`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("문의 reducer", res.data.inquiries);
      return res.data.inquiries;
    } catch (error: any) {
      console.error("문의 목록 요청 실패:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 문의 삭제 thunk
export const deleteAdminInquiry = createAsyncThunk<number, number>(
  "adminInquiries/deleteAdminInquiry",
  async (inquiryId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${baseURL}/admin/inquiries/${inquiryId}`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error: any) {
      console.error("문의 삭제 실패:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 문의 정보 상태 업데이트
export const patchInquiryStatus = createAsyncThunk<
  Inquiry,
  { id: number; status: "pending" | "resolved" }
>(
  "adminInquiries/patchInquiryStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${baseURL}/admin/inquiries/${id}/status`,
        { status },
        {
          withCredentials: true,
        }
      );
      return res.data.updated;
    } catch (error: any) {
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
      })
      // 삭제
      .addCase(deleteAdminInquiry.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.filter(
          (inquiry) => inquiry.id !== action.payload
        );
      })
      .addCase(deleteAdminInquiry.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // 수정
      .addCase(patchInquiryStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.inquiries.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.inquiries[idx] = updated;
        }
      })
      .addCase(patchInquiryStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default adminInquiriesSlice.reducer;
