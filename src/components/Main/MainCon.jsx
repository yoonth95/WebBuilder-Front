import React from 'react';
import 'styles/Main/MainCon.css';

const MainCon = ({ item }) => {
  const { id, title, subtitle, list } = item;

  return (
    <div key={id} className='main_con_wrap'>
      <p className='main_con_title'>
        {title} <span className='main_con_subtitle'>{subtitle}</span>
      </p>
      <ul className='main_con_list_wrap '>
        {list.map(({ contitle, src }) => (
          <li key={contitle} className='main_con_list'>
            <h2 className='main_con_list_title'>{contitle}</h2>
            <img className='main_con_list_img' src={src} alt={`${contitle} 로고`} loading='lazy' />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainCon;
