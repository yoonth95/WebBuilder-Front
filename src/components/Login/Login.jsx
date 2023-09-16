import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/userSlice';
import { loginAPI } from 'api/User/loginAPI';
import useInputValues from 'hooks/useInput';
import 'styles/Login/Login.css';

const Login = () => {
  const { inputValues, handleChange, reset } = useInputValues({ id: '', pw: '' });
  const { id, pw } = inputValues;

  const [error, setError] = useState({ id: '', pw: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const idInputRef = useRef(null);
  const pwInputRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const updateError = (name, errorMessage) => {
    setError(prev => ({ ...prev, [name]: errorMessage }));
  };

  const modifiedHandleChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;

    setError({ ...error, [name]: '' });

    if (name === 'id' && value.length >= 1 && !emailRegex.test(value)) {
      updateError('id', '이메일 형식으로 입력해주시기 바랍니다.');
    } else if (value === '') {
      updateError(name, name === 'id' ? '아이디를 입력해주세요.' : '비밀번호를 입력해주세요.');
    }
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      if (value.length >= 1 && !emailRegex.test(value)) {
        updateError('id', '이메일 형식으로 입력해주시기 바랍니다.');
      } else if (value === '') {
        updateError('id', '아이디를 입력해주세요.');
      }
    } else if (name === 'pw' && value === '') {
      updateError('pw', '비밀번호를 입력해주세요.');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    if (error.id === '아이디를 입력해주세요.' && error.pw === '비밀번호를 입력해주세요.') {
      setError({ id: '', pw: '' });
    } else {
      setError(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async () => {
    const userInfo = await loginAPI(id, pw);
    dispatch(setUser(userInfo));
    navigate(`/admin/${userInfo.user_idx}`);
  };

  const handleInvalidLogin = (err) => {
    if (err.message.includes('존재하지')) {
      updateError('id', err.message);
      reset('id');
      idInputRef.current.focus();
    } else if (err.message.includes('비밀번호')) {
      updateError('pw', err.message);
      reset('pw');
      pwInputRef.current.focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    
    setError({ id: '', pw: '' });

    if (id.length >= 1 && !emailRegex.test(id)) {
      updateError('id', '이메일 형식으로 입력해 주시기 바랍니다.');
      idInputRef.current.focus();
      return;
    }
  
    if (id === '' || pw === '') {
      if (id === '') updateError('id', '아이디를 입력해 주세요.');
      if (pw === '') updateError('pw', '비밀번호를 입력해 주세요.');
  
      (id === '' ? idInputRef : pwInputRef).current.focus();
      return;
    }

    try {
      await handleLogin();
    } catch (err) {
      handleInvalidLogin(err);
    }
  };


  return (
    <div className='admin'>
      <div className='login'>
        <div className='login_main'>
          <img className='logo' src="https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/logo.png" alt='로고 이미지' />
          <form className='login_form' onSubmit={submit}>
            <div className='inputTag'>
              <input ref={idInputRef} type='text' id='input_id' name='id' value={id} onChange={modifiedHandleChange} onFocus={handleFocus} onBlur={handleBlur}    />
              <label htmlFor='input_id'>
                Email <span style={{ paddingLeft:"5px", color: 'red' }}>*</span>
              </label>
              <p style={{height: '15px', padding: "0 0 10px 10px", color: '#ee7d00' }}>{error.id}</p>
            </div>
            <div className='inputTag'>
              <input ref={pwInputRef} type='password' id='input_pw' name='pw' value={pw} onChange={modifiedHandleChange} onFocus={handleFocus}  onBlur={handleBlur}   />
              <label htmlFor='input_pw'>
                Password <span style={{paddingLeft:"5px", color: 'red' }}>*</span>
              </label>
              <p style={{height: '15px', padding: "0 0 10px 10px", color: '#ee7d00' }}>{error.pw}</p>
            </div>
            <div className='link_box'>
              <Link to='/signup'>계정 만들기</Link>
              <Link to='#'>비밀번호를 잊어버리셨나요?</Link>
            </div>
            <button id='login_btn' type='submit'>
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
