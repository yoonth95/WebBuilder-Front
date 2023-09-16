import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateList } from 'redux/editorSlice';

import PropTypes from 'prop-types';

//redux
import { showAlert } from 'redux/AlertSlice';

// 컴포넌트 및 데이터
import designType from 'data/designType';
import { EditorRenderBox } from 'components/Editor/EditorRenderBox';
import EditorModal from 'components/Modal/EditorModal';
import ApplyTable from 'components/Editor/ApplyTable';
import SideBar from 'components/Editor/SideBar';
import LinkModal from 'components/Modal/LinkModal';
import { useEditorActions } from 'hooks/useEditor';
import { useImageActions } from 'hooks/useImage';

// icon 및 css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRotateRight, faArrowUp, faEdit, faTrash, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import 'styles/Editor/Block.css';

function Block({ block_id, design_type, design_id, block_order, layout_design, block_content, addBlock, deleteBlock, handleChangeBlockOrder, blockStyle, screenSize }) {
  const isDefault = design_type === 'default';
  const blockContainerRef = useRef(null);
  const { handleUpdateText, updateTableDataInBlock } = useEditorActions();
  const { addImageAction, deleteImageAction } = useImageActions();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showBlockBtn, setShowBlockBtn] = useState(false);
  const [checkBtn, setCheckBtn] = useState((blockStyle?.style.maxWidth === '100%' ? true : false) || false);
  const [isLayoutDesign, setIsLayoutDesign] = useState(false);
  const [layoutId, setLayoutId] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sideBarOpen, setSideBarOpen] = useState({ open: false, block_id: '' });
  const [isModalOpen, setIsModalOpen] = useState({ open: false, block_id: '' });
  const [isOpen, setIsOpen] = useState(false);
  const blocks = useSelector((state) => state.editor.blockList);

  const [LinkDic, setLinkDic] = useState({
    layout_id: '',
    block_id: '',
    idx: '',
    isLayout: '',
  });

  // 블록 마우스 오버 시 툴 바 버튼 보이게
  const handleShowBlockBtn = (e) => {
    e.type === 'mouseover' && screenSize === 'desktop' ? setShowBlockBtn(true) : setShowBlockBtn(false);
  };

  // 블록 디자인 렌더링
  const renderBox = (box, id) => {
    const clickHandler = () => setIsModalOpen({ open: true, block_id: id });

    const defaultStyle = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: '#ffffff',
    };

    const arg = {
      block_id: id, // 블록 id
      design: box, // design box 값
      blockStyle: blockStyle || defaultStyle, // 블록 스타일
      layout_design: layout_design, // 레이아웃 디자인
      screenSize: screenSize, // 스크린 사이즈
      clickHandler: clickHandler, // 모달 열기 (block_id 전달)
      setIsLayoutDesign: setIsLayoutDesign, // 레이아웃 디자인 여부
      setLayoutId: setLayoutId, // 레이아웃 id
      handleUpdateText: handleUpdateText, // 텍스트 수정 시
      attatchImg: attatchImg, // 이미지 첨부
      attatchLink: attatchLink, // 링크 첨부
      deleteImage: deleteImage, // 이미지 삭제
    };

    return EditorRenderBox[design_type](arg);
  };

  // 이미지 첨부
  const attatchImg = ({ tag, block_id, idx, isLayout }) => {
    console.log(isLayout);
    if (!tag.target.files[0] || !tag.target.files[0].type.includes('image')) {
      dispatch(showAlert('이미지 파일만 첨부해주세요.'));
      return;
    }
    addImageAction({ tag: tag, block_id: block_id, idx: idx, isLayout: isLayout, setProgress: setProgress, location: location.pathname });
  };

  // 링크 첨부
  const attatchLink = ({ block_id, idx, isLayout }) => {
    setIsOpen(!isOpen);
    setLinkDic({ block_id: block_id, idx: idx, isLayout: isLayout });
    console.log(LinkDic);
  };

  // 이미지 삭제 & 링크 삭제
  const deleteImage = ({ block_id, idx, isLayout }) => {
    deleteImageAction({ block_id: block_id, idx: idx, isLayout: isLayout });
  };

  // 툴 바 버튼
  const correctionBtn = [
    { icon: faEdit, clickFunc: () => setSideBarOpen({ open: true, block_id: block_id }) },
    { icon: faArrowRotateRight, clickFunc: () => setIsModalOpen({ open: true, block_id: block_id }) },
    { icon: faArrowUp, clickFunc: (id) => handleChangeBlockOrder(id, 'up') },
    { icon: faArrowDown, clickFunc: (id) => handleChangeBlockOrder(id, 'down') },
    { icon: faTrash, clickFunc: (id) => deleteBlock(id) },
  ];

  const updateColumnNamesInBlock = (blocks, block_id, col, newName) => {
    return blocks.map((block) => {
      if (block.block_id === block_id) {
        const updatedContent = {
          ...block.content,
          cols: {
            ...block.content.cols,
            [col]: newName,
          },
        };
        return {
          ...block,
          content: updatedContent,
        };
      }
      return block;
    });
  };

  const handleColumnNameChange = (blocks, block_id, col, newName) => {
    const updatedBlockList = updateColumnNamesInBlock(blocks, block_id, col, newName);
    dispatch(updateList(updatedBlockList));
  };
  const handleCellChange = (block_id, col, row, content) => {
    const updatedBlockList = updateTableDataInBlock(block_id, col, row, content);
    dispatch(updateList(updatedBlockList));
  };

  // 블록 추가 버튼 렌더링
  const renderAddBlockButton = (a) => {
    if (!sideBarOpen.open) {
      // SideBar가 열려있을 때는 추가버튼 숨김
      return (
        <div className='wrap_btn'>
          <button className={`btn_add_block ${showBlockBtn ? 'show_add_btn' : ''}`} onClick={() => addBlock(block_order, a)}>
            + 여기에 블록 추가
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div
        className='block_container'
        ref={blockContainerRef}
        onMouseOver={handleShowBlockBtn}
        onMouseLeave={handleShowBlockBtn}
        style={{ cursor: isDefault ? 'pointer' : '', height: isDefault ? '200px' : 'auto' }}
      >
        {renderAddBlockButton('before')}
        {isDefault ? (
          <>
            <div className='block_correction_btn delete_block_btn' style={{ display: showBlockBtn === true ? 'flex' : 'none' }}>
              <button className='block_function_btn'>
                <span onClick={() => correctionBtn[4].clickFunc(block_id)}>
                  <FontAwesomeIcon icon={correctionBtn[4].icon} />
                </span>
              </button>
            </div>
            <div
              className='wrap_design_select'
              onClick={() => {
                if (screenSize === 'desktop' && !sideBarOpen.open) {
                  setIsModalOpen({ open: true, block_id: block_id });
                  setIsLayoutDesign(false);
                }
              }}
            >
              <FontAwesomeIcon className='icon_design_select' icon={faWandMagicSparkles} size='2x' />
              {/* <p>
                {block_order} {block_id}
              </p> */}
              <p className='txt_design_select'>디자인을 선택하세요</p>
            </div>
          </>
        ) : (
          <>
            <div className='block_correction_btn' style={{ display: showBlockBtn === true ? 'flex' : 'none' }}>
              {correctionBtn.map(({ icon, clickFunc }, index) => (
                <button className='block_function_btn' key={index}>
                  <span onClick={() => clickFunc(block_id)}>
                    <FontAwesomeIcon icon={icon} />
                  </span>
                </button>
              ))}
            </div>
            {design_type === 'table' ? (
              <div className='module_block'>
                <div className='normal_module' style={{ backgroundColor: blockStyle.style.backgroundColor }}>
                  <div
                    className={`module_wrap ${checkBtn ? 'widthSet' : ''}`}
                    style={{ paddingTop: blockStyle.style.paddingTop, paddingBottom: blockStyle.style.paddingBottom, maxWidth: blockStyle.style.maxWidth }}
                  >
                    <div className='module_container'>
                      <ApplyTable design_id={design_id} block_id={block_id} handleCellChange={handleCellChange} handleColumnNameChange={handleColumnNameChange} screenSize={screenSize} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='module_block'>
                {block_content
                  ? renderBox(block_content, block_id, blockStyle, handleUpdateText)
                  : designType
                      .find((item) => item.type === design_type)
                      .boxes.filter((item) => item.id === design_id)
                      .map((box) => renderBox(box, block_id, blockStyle))}
              </div>
            )}
          </>
        )}
        {renderAddBlockButton('after')}
      </div>
      {isModalOpen.open && <EditorModal design_type={design_type} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} isLayoutDesign={isLayoutDesign} layoutId={layoutId} />}
      <div className={`block_container_side ${sideBarOpen.open ? 'open' : 'close'}`}>
        <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
      </div>
      {isOpen && <LinkModal isOpen={isOpen} setIsOpen={setIsOpen} block_id={block_id} LinkDic={LinkDic} />}
    </>
  );
}

export default Block;

Block.propTypes = {
  block_id: PropTypes.string.isRequired,
  design_type: PropTypes.string.isRequired,
  design_id: PropTypes.string.isRequired,
  block_order: PropTypes.number.isRequired,
  layout_design: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  addBlock: PropTypes.func.isRequired,
  deleteBlock: PropTypes.func.isRequired,
  handleChangeBlockOrder: PropTypes.func.isRequired,
};
