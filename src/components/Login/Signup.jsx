import React  from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from 'redux/AlertSlice';
import { useNavigate } from 'react-router-dom';
import 'styles/Login/Login.css';
import { signupAPI } from 'api/User/signupAPI';
import useInputValues from 'hooks/useInput';

const Signup = () => {
  const { inputValues, handleChange, reset } = useInputValues({
    name: '',
    id: '',
    pw: '',
  });
  const { name, id, pw } = inputValues;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitBtn = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === '' || id === '' || pw === '') {
      dispatch(showAlert('이름, 아이디, 비밀번호는 필수 입력입니다.'));
      return;
    } else if (!emailRegex.test(id)) {
      dispatch(showAlert('이메일 형식으로 입력해주시기 바랍니다.'));
      return;
    }

    try {
      await signupAPI(name, id, pw);
      dispatch(showAlert('회원가입 성공'));
      navigate('/');
    } catch (err) {
      dispatch(showAlert('회원가입 실패'));
      reset();
      return;
    }
  };

  return (
    <div className='admin'>
      <div className='login'>
        <div className='login_main'>
          <img className='logo' src="https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/logo.png" alt='로고 이미지' style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          <form className='login_form' onSubmit={submitBtn}>
            <div className='inputTag'>
              <input type='text' id='input_name' name='name' value={name} onChange={handleChange} />
              <label htmlFor='input_name'>
                Name <span style={{ color: '#EF4565' }}>*</span>
              </label>
            </div>
            <div className='inputTag'>
              <input type='text' id='input_id' name='id' value={id} onChange={handleChange} />
              <label htmlFor='input_id'>
                Email <span style={{ color: '#EF4565' }}>*</span>
              </label>
            </div>
            <div className='inputTag'>
              <input type='password' id='input_pw' name='pw' value={pw} onChange={handleChange} />
              <label htmlFor='input_pw'>
                Password <span style={{ color: '#EF4565' }}>*</span>
              </label>
            </div>
            <button id='login_btn' type='submit'>
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
