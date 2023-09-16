import React, { useEffect, useState } from 'react';
import { useMenuActions } from 'hooks/useMenu';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import 'styles/Main/Nav.css';

const Nav = ({ isLoading, setIsLoading, type, windowWidth, screenSize }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getMenuAction } = useMenuActions();
  const { firstList, secondList } = useSelector((state) => state.menu);
  const [currentMenuIdx, setCurrentMenuIdx] = useState(null);

  const user_idx = location.pathname.split('/')[2];

  useEffect(() => {
    const fetchMenu = async () => {
      const hasError = await getMenuAction(setIsLoading, user_idx);
      if (hasError) {
        navigate('/');
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className='container'>
      {windowWidth <= 1199 || screenSize === 'tablet' || screenSize === 'mobile' ? (
        <header className='mobile_header_wrap'>
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='moblie_icon' />
          </button>
          <img className='mobile_header_logo' onClick={() => navigate(`/main/${user_idx}`)} src={logo} alt='로고' />
          <button>
            <FontAwesomeIcon icon={faBars} className='moblie_icon' />
          </button>
        </header>
      ) : (
        <header className='header_wrap' onMouseEnter={() => setCurrentMenuIdx(null)}>
          <img className='header_wrap_logo' onClick={() => navigate(`/main/${user_idx}`)} src={logo} alt='로고' />
          <div className='header_right'>
            {logoList.map(({ id, src }) => (
              <img key={id} src={src} alt='로고' />
            ))}
            <div className='header_right_btn'>
              <button>회사소개</button>
              <button>인재채용</button>
            </div>
          </div>
        </header>
      )}
      {screenSize === 'tablet' || screenSize === 'mobile' ? null : (
        <nav className='gnb_wrap'>
          <div className='gnb'>
            <ul>
              {firstList.map((menu) => (
                <li
                  key={menu.idx}
                  className={`navWrap ${menu.idx === currentMenuIdx ? 'on' : ''}`}
                  onClick={() => {
                    navigate(`/${menu.link}`);
                  }}
                  onMouseEnter={() => setCurrentMenuIdx(menu.idx)}
                >
                  {menu.title}
                </li>
              ))}
            </ul>
            {!isLoading && (
              <div className='option' onMouseEnter={() => setCurrentMenuIdx(null)}>
                <button>
                  <FontAwesomeIcon icon={faBars} className='icon' />
                </button>
                <button>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className='icon' />
                </button>
              </div>
            )}
          </div>
          {type !== '편집' && (
            <div className={`gnb_info_wrap ${currentMenuIdx !== null ? 'on' : ''}`}>
              <div className='secondList_info_wrap' onMouseLeave={() => setCurrentMenuIdx(null)}>
                {firstList
                  .filter((menu) => menu.idx === currentMenuIdx)
                  .map((menu) => (
                    <div className='firstList_info' key={menu.idx} onMouseEnter={() => setCurrentMenuIdx(menu.idx)}>
                      {menu.title}
                    </div>
                  ))}
                <div className='list_wrap'>
                  {secondList
                    .filter((menu) => menu.parent_id === currentMenuIdx)
                    .map((menu) => (
                      <div
                        className='secondList_info'
                        key={menu.idx}
                        onClick={() => {
                          if (menu.new_window === 1) {
                            window.open(`/main/${user_idx}/pages/${menu.link}`, '_blank');
                          } else {
                            navigate(`/main/${user_idx}/pages/${menu.link}`);
                          }
                          setCurrentMenuIdx(null);
                        }}
                        onMouseEnter={() => setCurrentMenuIdx(menu.parent_id)}
                      >
                        {menu.title}
                      </div>
                    ))}
                </div>
              </div>
              <div className='back'></div>
            </div>
          )}
        </nav>
      )}
    </div>
  );
};

export default Nav;

const logo = 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/logo.png';

const logoList = [
  { id: '1', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_optionNavi1.png' },
  { id: '2', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_optionNavi2.png' },
  { id: '3', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_optionNavi3.png' },
];
