import React, { useState, useEffect } from 'react';
import 'styles/Admin/AdminHeader.css';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAPI } from 'api/User/logoutAPI';
import { showConfirm } from 'redux/AlertSlice'; 

const AdminHeader = () => {
  const [tab, setTab] = useState('menu');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onBtnClick = (text) => {
    setTab(text);
    setSortParams(text);
  };

  const setSortParams = (text) => {
    searchParams.set('tab', `${text === 'menu' ? 'a' : 'b'}`);
    setSearchParams(searchParams);
  };

  const logoutBtn = () => {
    dispatch(showConfirm({
      message: '로그아웃 하시겠습니까?',
      onConfirm: async () => {
        logoutAPI(dispatch);
        navigate('/')
      },
  }));
  };

  useEffect(() => {
    const tabValue = searchParams.get('tab');
    if (!tabValue || tabValue === 'a') {
      setTab('menu');
      setSortParams('menu');
    } else {
      setTab(tabValue === 'b' ? 'page' : 'menu');
    }
  }, [searchParams]);

  return (
    <header className='header'>
      <div className='info_box'>
        <img src="https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/logo.png" onClick={() => onBtnClick('menu')} alt='로고 이미지' />
        <div>
          <span onClick={() => navigate(`/main/${location.pathname.split("/").at(-1)}`)}>메인페이지</span>
          <span className='line' style={{textAlign: "center"}}>&#124;</span>
          <span onClick={logoutBtn}>로그아웃</span>
        </div>
      </div>
      <div className='btn_box'>
        <button className={tab === 'menu' ? 'check' : ''} onClick={() => onBtnClick('menu')} >
          페이지 관리
        </button>
        <button className={tab === 'page' ? 'check' : ''} onClick={() => onBtnClick('page')} >
          디자인 관리
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
