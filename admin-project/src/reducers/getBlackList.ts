import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface BlacklistedUser {
  id: number;
  reason: string;
  created_at: string;
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

// 블랙리스트 추가
export const addBlacklistUser = createAsyncThunk<
  AddBlacklistResponse, // 성공 시 반환 타입
  { userId: number; reason: string }, // 전달 인자 타입
  { rejectValue: string } // 실패 시 반환 타입
>("blacklist/addUser", async ({ userId, reason }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/admin/blacklist/${userId}`,
      { reason },
      { withCredentials: true }
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
    const res = await axios.get("http://localhost:5000/admin/blacklist", {
      withCredentials: true,
    });
    // console.log("블랙리스트 조회 reducer", res.data);
    return res.data.blacklists;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "블랙리스트 조회 실패"
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
      });
  },
});

export const { resetBlacklistStatus } = blacklistSlice.actions;
export default blacklistSlice.reducer;
