import { useDispatch, useSelector } from 'react-redux';
import { updateList } from 'redux/menuSlice';
import { showAlert } from 'redux/AlertSlice';
import { GetMenuAPI, DeleteMenuAPI, UpdateMenuAPI, InsertMenuAPI, OrderMenuAPI } from '../api/Admin';

export const useMenuActions = () => {
  const dispatch = useDispatch();
  const { firstList, secondList } = useSelector((state) => state.menu);
  const { user } = useSelector((state) => state.user);

  // 메뉴 조회
  const getMenuAction = async (setIsLoading, user_idx) => {
    try {
      const data = user ? await GetMenuAPI(false, user.user_id) : await GetMenuAPI(true, user_idx);
      let f_list = [];
      let s_list = [];
      data.forEach((item) => {
        !item.parent_id ? f_list.push(item) : s_list.push(item);
      });
      dispatch(updateList({ listName: 'firstList', newList: f_list }));
      dispatch(updateList({ listName: 'secondList', newList: s_list }));
      setIsLoading(false);
    } catch (err) {
      console.error(err.message);
      dispatch(showAlert('조회 오류'));
      setIsLoading(true);
      return true;
    }
  };

  // 메뉴 삭제
  const deleteMenuAction = async (id, order_num, parent_id) => {
    try {
      const userID = user.user_id;

      await DeleteMenuAPI(id, order_num, parent_id, userID);
      const newFirstList = firstList.filter((item) => item.idx !== id);
      const newSecondList = secondList.filter((item) => item.idx !== id);
      dispatch(updateList({ listName: 'firstList', newList: newFirstList }));
      dispatch(updateList({ listName: 'secondList', newList: newSecondList }));
      dispatch(showAlert('삭제 완료'));
    } catch (err) {
      console.error(err.message);
      dispatch(showAlert('삭제 오류'));
    }
  };

  // 메뉴 수정
  const updateMenuAction = async (formData) => {
    try {
      await UpdateMenuAPI(formData);
      const updatedFirstList = firstList.map((item) => (item.idx === formData.idx ? { ...item, ...formData } : item));
      const updatedSecondList = secondList.map((item) => (item.idx === formData.idx ? { ...item, ...formData } : item));
      dispatch(updateList({ listName: 'firstList', newList: updatedFirstList }));
      dispatch(updateList({ listName: 'secondList', newList: updatedSecondList }));
      dispatch(showAlert('수정 완료'));
    } catch (err) {
      console.error(err.message);
      dispatch(showAlert('수정 오류'));
    }
  };

  // 메뉴 추가
  const insertMenuAction = async (title, link, parent_id, new_window, setIsOpen, reset) => {
    try {
      const userID = user.user_id;
      const data = await InsertMenuAPI(title, link, parent_id, new_window, userID);
      dispatch(showAlert('메뉴를 추가하였습니다.'));
      setIsOpen(false);
      reset();

      if (parent_id) {
        dispatch(updateList({ listName: 'secondList', newList: [...secondList, data] }));
      } else {
        dispatch(updateList({ listName: 'firstList', newList: [...firstList, data] }));
      }
    } catch (err) {
      dispatch(showAlert('수정 오류'));
      console.log(err.message);
    }
  };

  // 메뉴 순서 변경
  const orderMenuAction = async (type, reorderedList) => {
    const newReorderedList = reorderedList.map((item, index) => ({
      ...item,
      order_num: index + 1,
    }));

    const listName = type === 'group' ? 'firstList' : 'secondList';
    const oldList = listName === 'firstList' ? firstList : secondList;
    dispatch(updateList({ listName: listName, newList: newReorderedList }));

    try {
      await OrderMenuAPI(newReorderedList);
    } catch (err) {
      dispatch(updateList({ listName: listName, newList: oldList }));
      dispatch(showAlert("순서 변경 오류"));
      console.log(err.message);
    }
  }

  return { getMenuAction, deleteMenuAction, updateMenuAction, insertMenuAction, orderMenuAction };
};