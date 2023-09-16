import React, { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useMenuActions } from 'hooks/useMenu';
import { useEditorActions } from 'hooks/useEditor';
import { showAlert } from 'redux/AlertSlice';

import SelectBox from 'components/Management/SelectBox';
import useInputValues from 'hooks/useInput';
import 'styles/Modal/Modal.css';
import { useLocation } from 'react-router-dom';

const Modal = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { btn } = useSelector((state) => state.btn);
  const { page } = useSelector((state) => state.page);
  const { secondList } = useSelector((state) => state.menu);
  const inputRef = useRef(null);
  const { insertMenuAction } = useMenuActions();
  const { designCopyAction } = useEditorActions();
  const { inputValues, handleChange, reset } = useInputValues({
    title: '',
    link: '',
    new_window: 0,
  });
  const [selectIdx, setSelectIdx] = useState(0); // select box index
  const { title, link, new_window } = inputValues;
  const parent_id = btn ? Number(btn.slice(2)) : null;

  const closeModal = () => {
    if (btn === '메뉴') {
      reset();
      setIsOpen(false);
    } else {
      reset();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (btn !== '복제' && isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  const addMenu = () => {
    const saveParentMenu = async () => {
      if (title === '') {
        dispatch(showAlert('페이지 명을 정해 주세요'));
        return;
      }
      await insertMenuAction(title, link, parent_id, new_window, setIsOpen, reset);
      window.scrollTo(0, document.body.scrollHeight);
    };

    const savedownMenu = async () => {
      if (title === '' || link === '') {
        dispatch(showAlert('페이지 명 또는 링크를 적어주세요'));
        return;
      }
      await insertMenuAction(title, link, parent_id, new_window, setIsOpen, reset);
    };

    const saveCopyPage = async () => {
      if (link === '') {
        dispatch(showAlert('디자인 복제할 페이지를 선택 해주세요'));
        return;
      }

      await designCopyAction(page, selectIdx, setIsOpen, reset);
    };

    if (btn === '메뉴') {
      saveParentMenu();
    } else if (btn === '복제') {
      saveCopyPage();
    } else {
      savedownMenu();
    }
  };

  return (
    <>
      {isOpen && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={handleModalContentClick}>
            <div className='modal_infor_box'>
              <span>{btn !== '메뉴' && btn !== '복제' ? '메뉴 항목 추가' : `페이지 디자인 ${btn}`}</span>
              {btn === '메뉴' ? (
                <input ref={inputRef} type='text' className='pageInput' name='title' placeholder={btn === '메뉴' ? '메뉴 항목' : `페이지 명`} value={title} onChange={handleChange} />
              ) : btn !== '복제' ? (
                <>
                  <input ref={inputRef} type='text' className='pageInput' name='title' placeholder={btn === '메뉴' ? '메뉴 항목' : `페이지 명`} value={title} onChange={handleChange} />
                  <input type='text' className='pageInput' name='link' placeholder='페이지 주소' value={link} onChange={handleChange} />
                  <div className='modal_page_infor'>
                    <p>{`http://localhost:3000/main/${location.pathname.split("/").at(-1)}/pages/${link}`}</p>
                    <div style={{ display: btn === '복제' ? 'none' : 'block' }}>
                      <input type='checkbox' name='new_window' checked={new_window} onChange={handleChange} />
                      새창 열기
                    </div>
                  </div>
                </>
              ) : (
                <SelectBox type={'복제'} secondList={secondList} link={link} handleLinkChange={handleChange} setSelectIdx={setSelectIdx} page={page}/>
              )}
            </div>
            <div className='modal_btn_box'>
              <button onClick={closeModal}>닫기</button>
              <button onClick={addMenu}>저장</button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Modal;
