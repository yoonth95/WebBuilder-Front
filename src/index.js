import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'redux/store';
import Router from './Router';
import 'styles/Reset.css';
import 'styles/ckeditor.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router />
  </Provider>
  // <React.StrictMode>
  // </React.StrictMode>,
);
