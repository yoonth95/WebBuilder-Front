import React from 'react';
import { setBtn } from 'redux/buttonSlice';
import { setPageId } from 'redux/pageSlice';
import {useNavigate} from 'react-router-dom'


const PageList = ({menu,parentList,setIsOpen,dispatch}) => {
  const navigate = useNavigate();

  const dateFormat = (updatedAt) => {
    const updatedAtDate = new Date(updatedAt);
    const koreanTimezoneOffset = 9 * 60;
    const koreanTime = new Date(updatedAtDate.getTime() + koreanTimezoneOffset * 60000);
    return koreanTime.toISOString().slice(0, 19).replace('T', ' ');
  };

  return (
    <div className='info'>
      <div className='info_content title' title={menu.title}>
        {menu.title}
      </div>
      <div className='info_content link' title={`/pages/${menu.link}`}>
        /pages/{menu.link}
      </div>
      <div className='info_content btn'>
        <span className='txt_info_content_btn' title={parentList.filter((e) => e.idx === menu.parent_id)[0].title}>
          {parentList.filter((e) => e.idx === menu.parent_id)[0].title}
        </span>
      </div>
      <div className='info_content date'>{dateFormat(menu.updated_at)}</div>
      <div className='info_content' id='info_btn'>
        <button
          onClick={() => {
            setIsOpen(true);
            dispatch(setBtn('복제'));
            dispatch(setPageId(menu.idx))
          }}
        >
          복제
        </button>
        <button onClick={() => navigate(`/editor/${menu.link}/${menu.idx}`)}>편집</button>
      </div>
    </div>
  );
};

export default PageList;
