import { configureStore } from '@reduxjs/toolkit';
// import logger from "redux-logger";
import UserSlice from './userSlice';
import ButtonSlice from './buttonSlice';
import menuSlice from './menuSlice';
// import selectBoxSlice from './selectBoxSlice';
import editorSlice from './editorSlice';
import pageSlice from './pageSlice';
import alertSlice from './AlertSlice';

const store = configureStore({
  reducer: {
    user: UserSlice,
    btn: ButtonSlice,
    menu: menuSlice,
    page: pageSlice,
    // selectBox: selectBoxSlice,
    editor: editorSlice,
    alert: alertSlice
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;
