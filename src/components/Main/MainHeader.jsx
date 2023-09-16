import React, { useState, useEffect } from 'react';
import 'styles/Admin/AdminHeader.css';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import logo from 'assets/images/logo.svg';

import { logoutAPI } from 'api/User/logoutAPI';
import { useDispatch } from 'react-redux';
import { showConfirm } from 'redux/AlertSlice'; 

const MainHeader = () => {
  const [tab, setTab] = useState('menu');
  const [searchParams, setSearchParams] = useSearchParams();
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

  const logout = () => {
    dispatch(showConfirm({
      message: '로그아웃 하시겠습니까?',
      onConfirm: async () => {
        logoutAPI(dispatch);
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
  }, []);

  return (
    <header className='header'>
      <div className='info_box'>
        <img src={logo} onClick={() => onBtnClick('menu')} alt='로고 이미지' />
        <div>
          <span onClick={() => navigate('/mypage')}>메인페이지</span>
          <span className='line' style={{textAlign: "center"}}>&#124;</span>
          <span onClick={logout}>로그아웃</span>
        </div>
      </div>
      <div className='btn_box'>
        <button className={tab === 'menu' ? 'check' : ''} onClick={() => onBtnClick('menu')} style={tab === 'menu' ? {} : { border: '0.5px solid var(--grayscale-30, #B3B3B3)' }}>
          메뉴 관리
        </button>
        <button className={tab === 'page' ? 'check' : ''} onClick={() => onBtnClick('page')} style={tab === 'page' ? {} : { border: '0.5px solid var(--grayscale-30, #B3B3B3)' }}>
          페이지 관리
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
