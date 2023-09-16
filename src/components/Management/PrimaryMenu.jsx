import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditForm from './EditForm';
import Dropdown from 'components/DropDown/DropDown';
import 'styles/Management/PrimaryMenu.css';

const PrimaryMenu = ({ toggleImage, clickId, editMenuIds, editMenu, deleteMenu, menu, firstList, secondList }) => {
  return (
    <div className='primaryMenus_wrap'>
      <div className={`primaryMenus ${editMenuIds.includes(menu.idx) ? 'withEdit' : ''}`}>
        <div className='img_wrap' onClick={() => toggleImage(menu.idx)}>
          <button className={`btn_arrow ${clickId.includes(menu.idx) ? 'btn_rotation' : ''}`}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <h1>{menu.title}</h1>
        <div className='box'>
          <button>
            <span  onClick={() => {
              editMenu(menu.idx);
            }}>
            <FontAwesomeIcon icon={faGear} />
            </span>
          </button>
          <button>
          <span onClick={() => deleteMenu(menu.idx, menu.order_num)}>
            <FontAwesomeIcon icon={faXmark} />
            </span>
          </button>
        </div>
      </div>
      <Dropdown visibility={editMenuIds.includes(menu.idx)}>
        <EditForm curMenuData={menu} firstList={firstList} secondList={secondList} editMenu={editMenu} />
      </Dropdown>
    </div>
  );
};

export default PrimaryMenu;
