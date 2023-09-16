import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='admin'>
      <div className='not_found'>
        <div className='not_found_main'>
          <img className='logo' src="https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/logo.png" onClick={() => navigate('/')} alt='로고 이미지' />
          <p className='not_found_text'>
            찾을 수 없는 페이지입니다. <br />
            요청하신 페이지가 사라졌거나,잘못된 경로를 이동 하셨습니다.
          </p>
          <button className='not_found_btn' onClick={() => navigate('/')}>
            메인 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
