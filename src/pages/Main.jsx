import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from 'components/Main/Nav';
import MainCon from 'components/Main/MainCon';

import 'styles/Main/Main.css';

const Main = ({ isLoading, setIsLoading }) => {
  const { user_idx } = useParams();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const nextImage = () => {
    setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // 이전 이미지로 이동
  const prevImage = () => {
    setCurrentCarouselIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // 현재 페이지 크기
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    const timer = setTimeout(nextImage, 3500); // 3.5초마다 다음 이미지로 넘어가도록 설정

    return () => {
      clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머를 정리(cleanup)
    };
  }, [currentCarouselIndex]);

  return (
    <div className='wrapper'>
      <div className='main_wrap'>
        <Nav isLoading={isLoading} setIsLoading={setIsLoading} windowWidth={windowWidth} user_idx={user_idx} />
        <div className='carousel'>
          <div className='carousel-slider' style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}>
            {(windowWidth > 1099 ? images : smallImages).map((image, index) => (
              <img key={index} src={image} alt={`Image ${index + 1}`} />
            ))}
          </div>
          <div className='carousel_btn'>
            <div>
              {currentCarouselIndex + 1} / {images.length}
            </div>
            <button onClick={prevImage}>&lt;</button>
            <button onClick={nextImage}>&gt;</button>
          </div>
        </div>
        {conLists.map((item) => (
          <MainCon key={item.id} item={item} />
        ))}
        <div className='btn_flooting'>
          {(windowWidth <= 1098 ? flootiningMobileLists : flootingLists).map((flooting) => (
            <div className={`flooting ${flooting.title}Section`} key={flooting.id}>
              <p className={`flootText ${flooting.title}Text`}>
                {flooting.text}
                {flooting.subtext && (
                  <>
                    <br />
                    {flooting.subtext}
                  </>
                )}
              </p>
              <img className={`flootImg ${flooting.title}Image`} src={flooting.src} alt='로고' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;

const baseUrl = 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/main_v2023/v2023_pd_list_';

const conLists = [
  {
    id: '01',
    title: '웅진 씽크빅',
    subtitle: '아이수준에 맞춰 선택과 조합이 가능한 맞춤형 학습지',
    list: [
      { contitle: '스마트 바로쓰기', src: `${baseUrl}00.png` },
      { contitle: '초단기한글', src: `${baseUrl}01.png` },
      { contitle: '놀이로 호기심 꺠치기', src: `${baseUrl}02.png` },
      { contitle: 'AI바로셈', src: `${baseUrl}03.png` },
    ],
  },
  {
    id: '02',
    title: '웅진 스마트',
    subtitle: '유아부터 초등, 중학까지 전과목 AI 스마트 학습',
    list: [
      { contitle: '쿠키', src: `${baseUrl}05.png` },
      { contitle: '키즈', src: `${baseUrl}06.png` },
      { contitle: '초등', src: `${baseUrl}07.png` },
      { contitle: '중학', src: `${baseUrl}08.png` },
    ],
  },
  {
    id: '03',
    title: '웅진북클럽',
    subtitle: '2만여 개 콘텐츠를 보유한 세상에서 가장 큰 도서관',
    list: [
      { contitle: '북클럽', src: `${baseUrl}09.png` },
      { contitle: '전집', src: `${baseUrl}10.png` },
      { contitle: '베베북클럽', src: `${baseUrl}11.png` },
      { contitle: '슈퍼팟잉글리시', src: `${baseUrl}12.png` },
    ],
  },
];

const images = [
  'https://online-cloud.wjthinkbig.com/contents/banner/6a3dda1d-d71a-418f-b685-87d677196e5e.jpg',
  'https://online-cloud.wjthinkbig.com/contents/banner/bcfd27f3-844e-44ff-87ed-25abea584c7a.png',
  'https://online-cloud.wjthinkbig.com/contents/banner/7aa76954-01ad-4bb9-b194-c07995a967d2.png',
  'https://online-cloud.wjthinkbig.com/contents/banner/95d4f82a-1ddf-46d9-ba7f-d570354af95d.jpg',
];

const smallImages = [
  'https://online-cloud.wjthinkbig.com/contents/banner/c332dd15-6a60-4dba-918f-847f1dfcad1d.jpg',
  'https://online-cloud.wjthinkbig.com/contents/banner/90bdb6c9-cd82-49d9-9cfb-b93cdf2baf18.png ',
  'https://online-cloud.wjthinkbig.com/contents/banner/c0b640bc-9d3c-4905-bcce-b2b82faa77bd.png',
  'https://online-cloud.wjthinkbig.com/contents/banner/f1720231-8dbb-4ffa-b73b-84bbad0e68d1.jpg',
];

const flootingLists = [
  { id: 10, title: 'trial', text: '무료체험', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_flooting1.png' },
  { id: 20, title: 'consultation', text: '상담신청', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_flooting2.png' },
];

const flootiningMobileLists = [
  { id: 10, title: 'trial', text: '무료', subtext: '체험', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_flooting1_m.png' },
  { id: 20, title: 'consultation', text: '상담', subtext: '신청', src: 'https://cache.wjthinkbig.com/WEB_RESOURCE/WJBOOKCLUB/images/layout_2023/img_flooting2_m.png' },
];
