import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface BlacklistedUser {
  id: number;
  reason: string;
  created_at: string;
  targetUserId: number;
}

interface BlacklistState {
  loading: boolean;
  error: string | null;
  success: boolean;
  list: BlacklistedUser[];
}

const initialState: BlacklistState = {
  loading: false,
  error: null,
  success: false,
  list: [],
};

interface AddBlacklistResponse {
  ok: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 블랙리스트 추가
export const addBlacklistUser = createAsyncThunk<
  AddBlacklistResponse, // 성공 시 반환 타입
  { userId: number; reason: string }, // 전달 인자 타입
  { rejectValue: string } // 실패 시 반환 타입
>("blacklist/addUser", async ({ userId, reason }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("access_token");

    const res = await axios.post(
      `${baseURL}/admin/blacklist/${userId}`,
      { reason },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 토큰을 Authorization 헤더로 전송
        },
      }
    );

    if (!res.data?.ok) {
      return rejectWithValue("블랙리스트 추가 실패 (응답 실패)");
    }
    console.log("블랙리스트 추가 reducer", res.data);
    return res.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
    console.error("블랙리스트 추가 에러:", error);
    return rejectWithValue(error.response?.data?.message || "서버 오류 발생");
  }
});

// 블랙리스트 전체 조회
export const getBlacklist = createAsyncThunk<
  BlacklistedUser[], // 성공 시 반환 타입
  void,
  { rejectValue: string }
>("blacklist/getList", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("access_token");

    const res = await axios.get(`${baseURL}/admin/blacklist`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰을 Authorization 헤더로 전송
      },
    });
    console.log("블랙리스트 조회 reducer", res.data);
    return res.data.blacklists;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "블랙리스트 조회 실패"
    );
  }
});

// 블랙리스트 삭제(일반유저 전환)
export const removeBlacklistUser = createAsyncThunk<
  { userId: number }, // 성공 시 반환값: 삭제한 userId
  number, // 전달 인자: userId
  { rejectValue: string }
>("blacklist/removeUser", async (userId, { rejectWithValue }) => {
  try {
    const token = Cookies.get("access_token");

    const res = await axios.delete(`${baseURL}/admin/blacklist/${userId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰을 Authorization 헤더로 전송
      },
    });

    if (!res.data?.ok) {
      return rejectWithValue("블랙리스트 해제 실패 (응답 실패)");
    }
    console.log("블랙리스트 삭제", res.data);
    return res.data; // 성공 시 삭제된 ID 반환
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "블랙리스트 해제 실패"
    );
  }
});

// Slice
const blacklistSlice = createSlice({
  name: "blacklist",
  initialState,
  reducers: {
    resetBlacklistStatus(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 블랙리스트 추가
      .addCase(addBlacklistUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addBlacklistUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addBlacklistUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 블랙리스트 전체 조회
      .addCase(getBlacklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlacklist.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getBlacklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 블랙리스트 삭제
      .addCase(removeBlacklistUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBlacklistUser.fulfilled, (state, action) => {
        state.loading = false;
        // list에서 해당 유저 제거
        state.list = state.list.filter(
          (user) => user.id !== action.payload.userId
        );
      })
      .addCase(removeBlacklistUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetBlacklistStatus } = blacklistSlice.actions;
export default blacklistSlice.reducer;
