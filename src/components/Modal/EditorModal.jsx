import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

//redux 
import { showAlert } from 'redux/AlertSlice';

// hooks
import { useEditorActions } from 'hooks/useEditor';


// 컴포넌트 및 데이터
import designType from 'data/designType';
import { ModalRenderBox } from 'components/Editor/ModalRenderBox';
import Table from 'components/Editor/Table';

// icon 및 css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import 'styles/Modal/EditorModal.css';

const EditorModal = ({ design_type, isModalOpen, setIsModalOpen, isLayoutDesign, layoutId }) => {
  const defaultType = design_type === 'default' ? 'image' : isLayoutDesign ? 'image' : design_type;
  const dispatch = useDispatch();
  const [selectedDesignId, setSelectedDesignId] = useState(0);
  const [selectedDesignType, setSelectedDesignType] = useState(defaultType);
  const [activeCell, setActiveCell] = useState(null);

  const { updateBlockDesignAction, updateBlockLayoutAction } = useEditorActions();

  const designSelectType = (type) => {
    setSelectedDesignType(type);
    setSelectedDesignId(0);
    setActiveCell(null);
  };
  const designSelectId = (id) => {
    setSelectedDesignId(id);
  };

  const handleGetBlock = async () => {
    if (selectedDesignId === 0 && !activeCell) {
      dispatch(showAlert('디자인을 선택해주세요.'));
      return;
    }

    // 레이아웃 디자인 수정 시
    if (isLayoutDesign) {
      if (selectedDesignType === 'table' && activeCell) {
        const [rows, cols] = activeCell;
        await updateBlockLayoutAction(isModalOpen.block_id, selectedDesignType, `${rows + 1},${cols + 1}`, layoutId);
      } else {
        const boxes = designType.find((item) => item.type === selectedDesignType).boxes.find((item) => item.id === selectedDesignId);
        await updateBlockLayoutAction(isModalOpen.block_id, selectedDesignType, selectedDesignId, layoutId, boxes);
      }
    }
    // 블록 디자인 수정 시
    else {
      if (selectedDesignType === 'table' && activeCell) {
        const [rows, cols] = activeCell;
        await updateBlockDesignAction(isModalOpen.block_id, selectedDesignType, `${rows + 1},${cols + 1}`);
      } else {
        await updateBlockDesignAction(isModalOpen.block_id, selectedDesignType, selectedDesignId);
      }
    }

    setIsModalOpen({ open: false, block_id: '' });
    // window.location.reload();
  };

  const renderBox = (box, index) => ModalRenderBox[selectedDesignType](box, index, designSelectId, selectedDesignId);
  const filterDesignType = isLayoutDesign ? designType.filter((item) => item.type !== 'layout') : designType;

  return (
    <>
      <div className='editModal-container'>
        <div className='editModal-header'>
          <h3 className='font-style'>블록 디자인 추가</h3>
          <span style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen({ open: false, block_id: '' })}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>
        <div className='editModal-main'>
          <div className='editModal-left font-style'>
            {filterDesignType.map((item) => (
              <p key={item.idx} className={selectedDesignType === item.type ? 'designSelect' : ''} onClick={() => designSelectType(item.type)}>
                {item.text}
              </p>
            ))}
            {(selectedDesignId !== 0 || activeCell !== null) && (
              <button className='editMenu-select-btn' onClick={handleGetBlock}>
                가져오기
              </button>
            )}
          </div>
          {selectedDesignType === 'table' ? (
            <div className='editModal_table'>
              <Table rows={6} cols={8} activeCell={activeCell} setActiveCell={setActiveCell} />
            </div>
          ) : (
            <div className='editModal-right' style={{ gridTemplateRows: `repeat(auto-fill, ${selectedDesignType === 'line' ? '96px' : '160px'})` }}>
              {filterDesignType.find((item) => item.type === selectedDesignType).boxes.map((box, index) => renderBox(box, index))}
            </div>
          )}
        </div>
      </div>
      <div className='editModal-overlay'></div>
    </>
  );
};

export default EditorModal;

EditorModal.propTypes = {
  design_type: PropTypes.string.isRequired,
  isModalOpen: PropTypes.object.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  isLayoutDesign: PropTypes.bool.isRequired,
  layoutId: PropTypes.number.isRequired,
};
