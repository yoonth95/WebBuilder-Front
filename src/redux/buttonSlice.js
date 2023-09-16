import { createSlice } from '@reduxjs/toolkit';

export const ButtonSlice = createSlice({
    name: 'btn',
    initialState: {
        btn: null,
    },
    reducers: {
        setBtn: (state, action) => {
            state.btn = action.payload;
        },
    },
});

export const { setBtn } = ButtonSlice.actions;
export default ButtonSlice.reducer;