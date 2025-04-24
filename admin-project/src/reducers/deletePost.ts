import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface AdminPostState {
  deleting: boolean;
  deleteError: string | null;
  deletedPostIds: number[]; // 삭제된 게시글 id 추적 (optional)
}

const initialState: AdminPostState = {
  deleting: false,
  deleteError: null,
  deletedPostIds: [],
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// thunk 정의: 게시글 삭제
export const deletePostByAdmin = createAsyncThunk<
  { postId: number }, // 성공 시 반환 타입
  number, // payload 타입
  { rejectValue: string } // 실패 시 반환 타입
>("admin/deletePostByAdmin", async (postId, { rejectWithValue }) => {
  try {
    const token = Cookies.get("access_token");

    const res = await axios.delete(`${baseURL}/admin/posts/${postId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰을 Authorization 헤더로 전송
      },
    });
    // console.log(res.data);
    return { postId };
  } catch (err: any) {
    return rejectWithValue("게시글 삭제에 실패했습니다.");
  }
});

const adminPostSlice = createSlice({
  name: "adminPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deletePostByAdmin.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deletePostByAdmin.fulfilled, (state, action) => {
        state.deleting = false;
        state.deletedPostIds.push(action.payload.postId);
      })
      .addCase(deletePostByAdmin.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || "알 수 없는 오류";
      });
  },
});

export default adminPostSlice.reducer;
