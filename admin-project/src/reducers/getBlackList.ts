import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface BlacklistState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: BlacklistState = {
  loading: false,
  error: null,
  success: false,
};

// 블랙리스트 추가
export const addBlacklistUser = createAsyncThunk<
  void,
  { userId: number; reason: string }
>("blacklist/addUser", async ({ userId, reason }, { rejectWithValue }) => {
  try {
    await axios.post(
      `http://localhost:5000/admin/blacklist/${userId}`,
      {
        reason,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// 블랙리스트 전체 조회
// export const getBlacklist = createAsyncThunk<BlacklistedUser[]>(
//   "blacklist/getList",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("http://localhost:5000/admin/blacklist");
//       return res.data.blacklist;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

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
      });
  },
});

export const { resetBlacklistStatus } = blacklistSlice.actions;
export default blacklistSlice.reducer;
