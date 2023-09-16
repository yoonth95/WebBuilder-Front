import { createSlice } from '@reduxjs/toolkit';


export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        firstList: [],
        secondList: []
    },
    reducers: {
        updateList: (state, action) => {
            const { listName, newList } = action.payload;
            state[listName] = newList;
        }
    },
});

export const { updateList } = menuSlice.actions;
export default menuSlice.reducer;
