// reducers/adminCommentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// export interface DeleteComment {
//   commentId: number;
// }

interface AdminCommentState {
  deleting: boolean;
  deleteError: string | null;
  deletedCommentIds: number[];
}

const initialState: AdminCommentState = {
  deleting: false,
  deleteError: null,
  deletedCommentIds: [],
};

export const deleteCommentByAdmin = createAsyncThunk<
  { commentId: number }, // 성공 시 반환
  number, // 전달 인자
  { rejectValue: string }
>("admin/deleteCommentByAdmin", async (commentId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/admin/comments/${commentId}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.ok) {
      return { commentId };
    } else {
      return rejectWithValue("댓글 삭제 실패");
    }
  } catch (error: any) {
    console.error("삭제 요청 실패:", error);
    return rejectWithValue("서버 오류로 댓글 삭제 실패");
  }
});

const adminCommentSlice = createSlice({
  name: "adminComment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteCommentByAdmin.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteCommentByAdmin.fulfilled, (state, action) => {
        state.deleting = false;
        state.deletedCommentIds.push(action.payload.commentId);
      })
      .addCase(deleteCommentByAdmin.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || "알 수 없는 오류";
      });
  },
});

export default adminCommentSlice.reducer;
