import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface UsageStat {
  date: string;
  postsCount: number;
  chatsCount: number;
  paymentsCount: number;
}

interface ServiceUsageState {
  data: UsageStat;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceUsageState = {
  data: {
    date: "",
    postsCount: 0,
    chatsCount: 0,
    paymentsCount: 0,
  },
  loading: false,
  error: null,
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 📡 axios 요청
export const getServiceUsageStats = createAsyncThunk<UsageStat>(
  "adminDailyActivity/getServiceUsageStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}/admin/count`, {
        withCredentials: true,
      });
      console.log(res.data, "/??");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminDailyActivity = createSlice({
  name: "adminDailyActivity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServiceUsageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceUsageStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getServiceUsageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminDailyActivity.reducer;
