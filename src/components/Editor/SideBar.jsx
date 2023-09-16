import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateList } from 'redux/editorSlice';

import 'styles/Editor/SideBar.css';

const SideBar = ({ sideBarOpen, setSideBarOpen }) => {
  const [iconColor, setIconColor] = useState('#8f8f8f');
  const blockList = useSelector((state) => state.editor.blockList);
  const [blockPaddingTop, setBlockPaddingTop] = useState(0);
  const [blockPaddingBottom, setBlockPaddingBottom] = useState(0);
  const [blockBackgroundColor, setBlockBackgroundColor] = useState('#ffffff');
  const [blockCheckBtn, setBlockCheckBtn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sideBarOpen.block_id) {
      const block_style = JSON.parse(blockList.find((block) => block.block_id === sideBarOpen.block_id).block_style);
      setBlockPaddingTop(parseInt(block_style.style.paddingTop) || 0);
      setBlockPaddingBottom(parseInt(block_style.style.paddingBottom) || 0);
      setBlockBackgroundColor(block_style.style.backgroundColor || '#ffffff');
      setBlockCheckBtn(block_style.style.maxWidth === '1240px' ? false : true);
    }
  }, [sideBarOpen]);

  // 블록 너비 설정
  const handleWidthChange = (e) => {
    setBlockCheckBtn(e);
    const block_style = {
      style: {
        maxWidth: e ? '100%' : '1240px',
        paddingTop: `${blockPaddingTop}px`,
        paddingBottom: `${blockPaddingBottom}px`,
        backgroundColor: blockBackgroundColor,
      },
      block_id: sideBarOpen.block_id,
    }

    dispatch(updateList(blockList.map(block => {
      if (block.block_id === sideBarOpen.block_id) {
        return { ...block, block_style: JSON.stringify(block_style) };
      } else {
        return block;
      }
    })));
  };

  // 블록 padding top 설정
  const handleTopPaddingChange = (e) => {
    setBlockPaddingTop(e);
    const block_style = {
      style: {
        maxWidth: blockCheckBtn ? '100%' : '1240px',
        paddingTop: `${e}px`,
        paddingBottom: `${blockPaddingBottom}px`,
        backgroundColor: blockBackgroundColor,
      },
      block_id: sideBarOpen.block_id,
    }

    dispatch(updateList(blockList.map(block => {
      if (block.block_id === sideBarOpen.block_id) {
        return { ...block, block_style: JSON.stringify(block_style) };
      } else {
        return block;
      }
    })));
  };

  // 블록 padding bottom 설정
  const handleBottomPaddingChange = (e) => {
    setBlockPaddingBottom(e);
    const block_style = {
      style: {
        maxWidth: blockCheckBtn ? '100%' : '1240px',
        paddingTop: `${blockPaddingTop}px`,
        paddingBottom: `${e}px`,
        backgroundColor: blockBackgroundColor,
      },
      block_id: sideBarOpen.block_id,
    }

    dispatch(updateList(blockList.map(block => {
      if (block.block_id === sideBarOpen.block_id) {
        return { ...block, block_style: JSON.stringify(block_style) };
      } else {
        return block;
      }
    })));
  };

  // 블록 배경색 설정
  const handleBackgroundColorChange = (e) => {
    setBlockBackgroundColor(e);
    const block_style = {
      style: {
        maxWidth: blockCheckBtn ? '100%' : '1240px',
        paddingTop: `${blockPaddingTop}px`,
        paddingBottom: `${blockPaddingBottom}px`,
        backgroundColor: e,
      },
      block_id: sideBarOpen.block_id,
    }

    dispatch(updateList(blockList.map(block => {
      if (block.block_id === sideBarOpen.block_id) {
        return { ...block, block_style: JSON.stringify(block_style) };
      } else {
        return block;
      }
    })));
  };

  return (
    <div className='subMenu sub_menu' style={{ display: 'block' }}>
      <div className='title_wrap'>
        <h3>블록 설정</h3>
        <FontAwesomeIcon
          icon={faTimes}
          style={{ color: iconColor, cursor: 'pointer' }}
          onClick={() => setSideBarOpen(!sideBarOpen)}
          size='2x'
          onMouseEnter={() => setIconColor('#f3f3f3')}
          onMouseLeave={() => setIconColor('#8f8f8f')}
        />
      </div>
      {/* 블록 너비 설정 */}
      <div className='widthSet_wrap' onChange={() => handleWidthChange(!blockCheckBtn)}>
        <input type='checkbox' id='widthCheck' checked={blockCheckBtn} readOnly/>
        <label htmlFor='widthCheck'>화면 너비에 맞추기</label>
      </div>
      {/* 블록 패딩 설정 */}
      <div style={{ marginTop: '10px' }}>
        <p className='title1'>패딩 설정</p>
      </div>
      <ul className='sub_menu_list v2'>
        <li>
          <p className='title1' style={{ width: '100%' }}>
            상
            <span id='paddingTopVal' className='num'>
              {blockPaddingTop}px
            </span>
          </p>
          <div style={{ padding: '5px 0 0 10px', marginBottom: '10px' }}>
            <input
              type='range'
              className='radioCheckSelect range_style1'
              name='padding_top'
              min='0' max='400' step='10'
              value={blockPaddingTop}
              onChange={(e) => setBlockPaddingTop(e.target.value)}
              onMouseUp={(e) => handleTopPaddingChange(e.target.value)}
            />
            <ol className='range_datalist'>
              <li>0</li>
              <li>200</li>
              <li>400</li>
            </ol>
          </div>
        </li>
        <li>
          <p className='title1' style={{ width: '100%' }}>
            하
            <span id='paddingBottomVal' className='num'>
              {blockPaddingBottom}px
            </span>
          </p>
          <div style={{ padding: '5px 0 0 10px' }}>
            <input
              type='range'
              className='radioCheckSelect range_style1'
              name='padding_bottom'
              min='0' max='400' step='10'
              value={blockPaddingBottom}
              onChange={(e) => setBlockPaddingBottom(e.target.value)}
              onMouseUp={(e) => handleBottomPaddingChange(e.target.value)}
            />
            <ol className='range_datalist'>
              <li>0</li>
              <li>200</li>
              <li>400</li>
            </ol>
          </div>
        </li>
      </ul>
      {/* 블록 배경색 설정 */}
      <div style={{ marginTop: '10px' }}>
        <p className='title1'>배경색 설정</p>
      </div>
      <div style={{ padding: '20px' }}>
        <input 
          type="color" 
          className='sidebarColor' 
          defaultValue={blockBackgroundColor} 
          onBlur={(e) => handleBackgroundColorChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SideBar;
