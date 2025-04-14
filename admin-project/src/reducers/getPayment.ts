import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Payment {
  id: number;
  amount: number;
  payment_method: "card" | "test";
  status: "pending" | "success" | "failed";
  created_at: string;
  user_id: number;
  toss_payment_id: string;
  order_id: string;
}

interface AdminPaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminPaymentsState = {
  payments: [],
  loading: false,
  error: null,
};

// 결제 내역 요청 thunk
export const getAdminPayments = createAsyncThunk<Payment[]>(
  "adminPayments/getAdminPayments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/admin/payments");
      console.log(res.data);
      return res.data.payments;
    } catch (error: any) {
      console.error("결제 내역 요청 실패:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  slice
const adminPaymentsSlice = createSlice({
  name: "adminPayments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAdminPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminPaymentsSlice.reducer;
