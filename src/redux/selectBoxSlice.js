import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const selectBoxSlice = createSlice({
    name: 'selectBox',
    initialState,
    reducers: {
        addBlockAction: (state, action) => {
            const newBlock = {
                block_id: action.payload.block_id,
                design_type: action.payload.design_type,
                design_id: action.payload.design_id,
                block_order: action.payload.block_order
            };

            state.forEach(block => {
                if (block.block_order >= newBlock.block_order) block.block_order += 1;
            });

            state.splice(newBlock.block_order - 1, 0, newBlock);
        },
        removeBlockAction: (state, action) => {
            const block = state.find(block => block.block_id === action.payload.id);
            if(!block) return;

            const index = state.indexOf(block);
            state.splice(index, 1);

            state.forEach(block => {
                if (block.block_order > index + 1) block.block_order -= 1;
            });
        },
        setDesignType: (state, action) => {
            const block = state.find(block => block.block_id === action.payload.block_id);
            if(block) block.design_type = action.payload.design_type;
        },
        setDesignId: (state, action) => {
            const block = state.find(block => block.block_id === action.payload.block_id);
            if(block) block.design_id = action.payload.design_id;
        },
        setBlockOrder: (state, action) => {
            const block = state.find(block => block.block_id === action.payload.id);
            if(!block) return; 

            const targetIndex = action.payload.order;
            const offset = action.payload.dir === 'up' ? -1 : 1;

            if (targetIndex + offset <= 0 || targetIndex + offset > state.length) return;

            const targetBlock = state[targetIndex + offset - 1];
            if(!targetBlock) return;

            const temp = block.block_order;
            block.block_order = targetBlock.block_order;
            targetBlock.block_order = temp;

            state.sort((a, b) => a.block_order - b.block_order);
        },
        resetState: () => initialState,
    },
});

export const { addBlockAction, removeBlockAction, setDesignType, setDesignId, setBlockOrder, resetState } = selectBoxSlice.actions;
export default selectBoxSlice.reducer;