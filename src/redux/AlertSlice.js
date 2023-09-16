import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    showAlert: false,
    confirmMessage: null,
    onConfirm: null,
    onCancel: null,
    cancelled: false,
    toastMessage: null,  
    showToast: false, 
    progress: 0, 
};

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        // 기존 액션들
        showAlert: (state, action) => {
            state.message = action.payload;
            state.showAlert = true;  
        },
        hideAlert: (state) => {
            state.message = null;
            state.showAlert = false;  
        },
        // Confirm 액션들
        showConfirm: (state, action) => {
            state.confirmMessage = action.payload.message;
            state.onConfirm = action.payload.onConfirm;
            state.onCancel = action.payload.onCancel;
        },
        confirm: (state) => {
            if (state.onConfirm) state.onConfirm();
            state.confirmMessage = null;
            state.onConfirm = null;
            state.onCancel = null;
        },
        cancel: (state) => {
            if (state.onCancel) state.onCancel();
            state.onCancel = null;
            state.cancelled = true;  
        },
        hideConfirm: (state) => {
            state.confirmMessage = null;
            state.onConfirm = null;
            state.onCancel = null;
            state.cancelled = false; 
        },
        showToast: (state, action) => {
            state.toastMessage = action.payload.message;  
            state.showToast = true;
            state.progress = 100;
            state.timer = action.payload.timer;
          },
        hideToast: (state) => {  
            state.toastMessage = null;
            state.showToast = false;
            state.progress = 0;
        },
        updateProgress: (state, action) => {  
            state.progress = action.payload;
        },
    },
});

export const { showAlert, hideAlert, showConfirm, confirm, cancel, hideConfirm, showToast, hideToast, updateProgress } = alertSlice.actions;
export default alertSlice.reducer;