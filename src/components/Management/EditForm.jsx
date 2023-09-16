import React, { useState } from 'react';
import { useMenuActions } from 'hooks/useMenu';
import useInputValues from 'hooks/useInput';
import SelectBox from './SelectBox';
import 'styles/Management/EditForm.css';
import { useDispatch } from 'react-redux';
import { showConfirm } from 'redux/AlertSlice'; 

const EditForm = ({ curMenuData, secondList, editMenu }) => {

  const dispatch = useDispatch();

  const { inputValues, handleChange } = useInputValues({
    editedTitle: curMenuData.title,
    editedLink: curMenuData.link,
    editedWindow: curMenuData.new_window,
  });

  const { editedTitle, editedLink, editedWindow } = inputValues;
  const { updateMenuAction } = useMenuActions();

  const updateMenu = (e, idx) => {
    e.preventDefault();

    const updateFetch = async () => {
      const formData = {
        idx: idx,
        title: editedTitle,
        link: editedLink,
        new_window: editedWindow,
      };

      await updateMenuAction(formData);
    };

    // if (window.confirm('해당 메뉴를 수정 하시겠습니까?')) updateFetch();

    dispatch(showConfirm({
      message: '해당 메뉴를 수정 하시겠습니까?',
      onConfirm: async () => {
          await updateFetch(dispatch);
          editMenu(idx);
      },
      onCancel: () => {
          editMenu(idx);
      }
  }));

  };

  return (
      <form className='edit_wrap' onSubmit={(e) => updateMenu(e, curMenuData.idx)}>
        <label className='subMenu_label subMenu_title_label' htmlFor='subMenu_title'>
          제목
          <input id='subMenu_title' type='text' name='editedTitle' defaultValue={editedTitle} onChange={handleChange} />
        </label>
        <div className='edit_wrap_sub'>
          <label className='subMenu_label link_label' htmlFor='subMenu_link'>
            링크
              <SelectBox curMenuData={curMenuData} secondList={secondList} editedLink={editedLink} handleLinkChange={handleChange} />
          </label>
          <input type='checkbox' name='editedWindow' id={`subMenu_chkBox_${curMenuData.idx}`} className='new_window_chkBox' checked={editedWindow} onChange={handleChange} />
          <label htmlFor={`subMenu_chkBox_${curMenuData.idx}`} className='txt_new_window'>
            새 창 열기
          </label>
          <button className='save_btn' type='submit'>
            저장
          </button>
        </div>
      </form>
  );
};

export default EditForm;
