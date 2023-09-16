import { createSlice } from '@reduxjs/toolkit';

export const PageSlice = createSlice({
    name: 'page',
    initialState: {
      page: 0,
    },
    reducers: {
      setPageId: (state, action) => {
        state.page = action.payload;
      },
    },
});

export const { setPageId } = PageSlice.actions;
export default PageSlice.reducer;