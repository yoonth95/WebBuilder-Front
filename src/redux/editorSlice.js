import { createSlice } from '@reduxjs/toolkit';

export const editorSlice = createSlice({
    name: 'editor',
    initialState: {
      blockList: [],
    },
    reducers: {
      updateList: (state, action) => {
        state.blockList = action.payload;
      }
    },
});

export const { updateList } = editorSlice.actions;
export default editorSlice.reducer;
