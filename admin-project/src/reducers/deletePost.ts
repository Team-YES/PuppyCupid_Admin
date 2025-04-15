import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

// thunk 정의: 게시글 삭제
export const deletePostByAdmin = createAsyncThunk<
  { postId: number }, // 성공 시 반환 타입
  number, // payload 타입
  { rejectValue: string } // 실패 시 반환 타입
>("admin/deletePostByAdmin", async (postId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/admin/posts/${postId}`
    );
    console.log(res.data);
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
