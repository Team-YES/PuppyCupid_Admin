// src/reducers/adminUserSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ 유저 타입 정의
export interface AdminUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  phone: string;
  gender: string;
  role: "user" | "admin"; // 필요한 역할만 구체화 가능
  provider: string | null;
  isPhoneVerified: boolean;
  eid_refresh_token: string;
  created_at: string;
  power_expired_at: string | null;
}

// ✅ 초기 상태 타입
interface AdminUserState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// ✅ 초기 상태
const initialState: AdminUserState = {
  users: [],
  loading: false,
  error: null,
};

// ✅ 유저 정보 가져오는 비동기 thunk
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async () => {
    const res = await axios.get("http://localhost:5000/admin/users");
    // console.log(res.data);
    return res.data.users; // 보통 response.data.users 형태면 여기서 가공 가능
  }
);

// ✅ Slice 생성
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "유저 정보를 불러오지 못했습니다.";
      });
  },
});

export default adminUserSlice.reducer;
