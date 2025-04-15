import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 유저 타입 정의
export interface AdminUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  phone: string;
  gender: string;
  role: "user" | "admin";
  provider: string | null;
  isPhoneVerified: boolean;
  eid_refresh_token: string;
  created_at: string;
  power_expired_at: string | null;
}

// 초기 상태 타입
interface AdminUserState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: AdminUserState = {
  users: [],
  loading: false,
  error: null,
};

// 유저 정보 가져오는 비동기 thunk
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async () => {
    const res = await axios.get("http://localhost:5000/admin/users", {
      withCredentials: true,
    });
    // console.log(res.data);
    return res.data.users; // 보통 response.data.users 형태면 여기서 가공 가능
  }
);

// 유저 삭제 thunk
export const deleteAdminUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: number, { dispatch }) => {
    await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
      withCredentials: true,
    });
    // 삭제 후 유저 목록 갱신
    dispatch(fetchAdminUsers());
    return userId; // 필요 시 return (예: 알림용)
  }
);

// Slice 생성
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
      })

      // 삭제 처리
      .addCase(deleteAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.users = state.users.filter(user => user.id !== action.payload);
        // fetchAdminUsers로 갱신하므로 상태는 여기서 직접 수정하지 않아도 됨
      })
      .addCase(deleteAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "유저 삭제에 실패했습니다.";
      });
  },
});

export default adminUserSlice.reducer;
