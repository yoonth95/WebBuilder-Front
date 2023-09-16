import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { setBtn } from 'redux/buttonSlice';
import { useMenuActions } from 'hooks/useMenu';
import { showConfirm } from 'redux/AlertSlice';

// 컴포넌트
import SubMenu from './SubMenu';
import PrimaryMenu from './PrimaryMenu';
import AdminHeader from 'components/Admin/AdminHeader';
import Spinner from 'components/Spinner/Spinner';
import Dropdown from 'components/DropDown/DropDown';


// css
import 'styles/Management/Management.css';

const Management = ({ setIsOpen, setIsLoading, isLoading }) => {
  const { firstList, secondList } = useSelector((state) => state.menu);
  const [clickId, setClickId] = useState([]);
  const [editMenuIds, setEditMenuIds] = useState([]);
  const { getMenuAction, deleteMenuAction, orderMenuAction } = useMenuActions();
  const dispatch = useDispatch();

  useEffect(() => {
    getMenuAction(setIsLoading); // 메뉴 조회
  }, []);

  // 메뉴 drop down
  const toggleImage = (id) => {
    if (clickId.includes(id)) {
      setClickId((prevClickId) => prevClickId.filter((clickedId) => clickedId !== id));
    } else {
      setClickId((prevClickId) => [...prevClickId, id]);
    }
  };

  // 메뉴 항목 drop down
  const editMenu = (id) => {
    setEditMenuIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((editId) => editId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // 메뉴 삭제
  const deleteMenu = (id, order_num, parent_id) => {
    dispatch(showConfirm({
      message: '해당 메뉴를 삭제 하시겠습니까?',
      onConfirm: async () => {
       await deleteMenuAction(id, order_num, parent_id);
      },
    }));
  };

  // 메뉴 drag and drop
  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    // 목적지가 없을 경우 return
    if (!destination) return;

    // 시작지의 index와 id가 도착지의 index와 id가 같으면 return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // 상위 메뉴만 움직이기
    if (type === 'group') {
      const reorderedList = [...firstList];

      const storeSourceIndex = source.index; // 시작 index
      const storeDestinationIndex = destination.index; // 도착 index

      const [removedStore] = reorderedList.splice(storeSourceIndex, 1); // 시작 index에 있는 항목 지우기
      reorderedList.splice(storeDestinationIndex, 0, removedStore); // 도착 index에 시작 index 항목 넣기

      return orderMenuAction(type, reorderedList);
    }
    // 상위 메뉴에 속한 하위 메뉴만 움직이기
    else {
      const parent_id = parseInt(type.split('-')[1]);
      const reorderedList = secondList.filter((item) => item.parent_id === parent_id);

      const itemSourceIndex = source.index;
      const itemDestinationIndex = destination.index;

      const [removedItem] = reorderedList.splice(itemSourceIndex, 1);
      reorderedList.splice(itemDestinationIndex, 0, removedItem);

      // 다른 하위 메뉴들
      const otherItems = secondList.filter((item) => item.parent_id !== parent_id);

      return orderMenuAction(type, reorderedList, otherItems);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <AdminHeader />
      <div className='wrap'>
        <div className='menu_title_wrap'>
          <div className='menu_title'>
            <p>페이지 설정</p>
            <p>메뉴 항목과 페이지 설정해주세요.</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(true);
              dispatch(setBtn('메뉴'));
            }}
          >
            메뉴 항목 추가
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <Droppable droppableId='ROOT' type='group'>
            {(provided) => (
              <div className='menu_list_wrap' {...provided.droppableProps} ref={provided.innerRef}>
                {firstList.map((menu, index) => (
                  <Draggable draggableId={`${menu.idx}`} key={`${menu.idx}`} index={index}>
                    {(provided) => (
                      <div className='menu_list' {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                        <PrimaryMenu
                          toggleImage={toggleImage}
                          clickId={clickId}
                          editMenuIds={editMenuIds}
                          editMenu={editMenu}
                          deleteMenu={deleteMenu}
                          menu={menu}
                          firstList={firstList}
                          secondList={secondList}
                          />
                        <Dropdown visibility={clickId.includes(menu.idx)}>
                          <SubMenu
                            Droppable={Droppable}
                            Draggable={Draggable}
                            parentID={menu.idx}
                            editMenuIds={editMenuIds}
                            editMenu={editMenu}
                            deleteMenu={deleteMenu}
                            subMenus={secondList.filter((e) => e.parent_id === menu.idx)}
                            firstList={firstList}
                            secondList={secondList}
                            setIsOpen={setIsOpen}
                            setBtn={setBtn}
                          />
                        </Dropdown>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default Management;
