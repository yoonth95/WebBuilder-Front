import React from 'react';
import 'styles/Spinner/Loading.css';

const Loading = () => {
  return (
    <div className="modal_loading">
      <div className="modal_body">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default Loading;
