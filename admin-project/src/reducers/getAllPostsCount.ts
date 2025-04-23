import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface AllCount {
  count: number;
}

// 타입 정의
interface AdminPostsCountState {
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminPostsCountState = {
  count: 0,
  loading: false,
  error: null,
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Thunk (비동기 요청)
export const getAdminPostsCount = createAsyncThunk<number>(
  "adminPostsCount/getAdminPostsCount",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");

      const res = await axios.get(`${baseURL}/admin/postsCount`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 토큰을 Authorization 헤더로 전송
        },
      });
      return res.data.count;
    } catch (error: any) {
      console.error("게시글 개수 요청 실패:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const adminPostsCountSlice = createSlice({
  name: "adminPostsCount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPostsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPostsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(getAdminPostsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminPostsCountSlice.reducer;
