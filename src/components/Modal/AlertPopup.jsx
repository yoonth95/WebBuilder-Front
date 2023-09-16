import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideAlert,hideConfirm, confirm ,cancel,showToast,updateProgress,hideToast} from 'redux/AlertSlice';

import 'styles/Modal/AlertPopup.css';

const AlertPopup = () => {
    const dispatch = useDispatch();
    const { message, showAlert, confirmMessage, cancelled, toastMessage, showToast, progress } = useSelector(state => state.alert);  
    const [toastAnimation, setToastAnimation] = useState("");
   
    // Alert 메시지에 대한 useEffect
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(hideAlert());
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    // Confirm 메시지에 대한 useEffect
    useEffect(() => {
        if (cancelled) { 
                dispatch(hideConfirm());
        }
    }, [cancelled, dispatch]);  
    
    useEffect(() => {
        if (showToast) {
            setToastAnimation("slide-in");
            let progress = 100;
            const decrement = 100 / (3.3 / 0.1);
            const timer = setInterval(() => {
                progress -= decrement;
                if (progress <= 0) {
                    progress = 0;
                    clearInterval(timer);
                    setTimeout(() => {
                        setToastAnimation("slide-out");
                        setTimeout(() => {
                            dispatch(hideToast());
                            setToastAnimation("");
                        }, 500); 
                    }, 500); 
                }
                dispatch(updateProgress(progress));
            }, 75);
            return () => clearInterval(timer);
        }
    }, [showToast, dispatch]);


    return (
        <>
            {showAlert&&<div className="popup-backdrop">
                <div className={showAlert ? "alert-message" : ""}>
                    {message}
                </div>
            </div>}
            {confirmMessage && (
    <div className="popup-backdrop">
        <div className="popup-content">
            <p className="popup-message">{confirmMessage}</p>
            <div className="popup-buttons">
                <button className="confirm-button" onClick={() => {
                        dispatch(confirm());
                        dispatch(hideConfirm()); 
                    }}>
                    확인
                </button>
                <button className="cancel-button" onClick={() => dispatch(cancel())}>취소</button>
            </div>
        </div>
    </div>
)}
{showToast && <div className="popup-backdrop">
      <div className={`toast-message ${toastAnimation}`}>
        <p>{toastMessage}</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>}
        </>
    );
};

export default AlertPopup;