import React, { useEffect, useState } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { updateList } from 'redux/editorSlice';
import { showAlert } from 'redux/AlertSlice';


// 컴포넌트
import Spinner from 'components/Spinner/Spinner';
import AdminHeader from 'components/Admin/AdminHeader';
import PageList from 'components/Pagement/PageList';

// api
import { GetMenuAPI } from 'api/Admin/GetMenuAPI';

//hook

// icon 및 css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'styles/Pagement/Pagement.css';

const Pagement = ({ setIsOpen, setIsLoading, isLoading }) => {
  const dispatch = useDispatch();
  const [pageList, setPageList] = useState([]);
  const [parentList, setParentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const Page = 5;
  const { user } = useSelector((state) => state.user);
  
  const getMenu = async () => {
    setIsLoading(true);
    try {
      const data = await GetMenuAPI(false, user.user_id);
      setPageList(data.filter((e) => e.parent_id).sort((a, b) => a.parent_id - b.parent_id));
      setParentList(data.filter((e) => e.parent_id == null));
      dispatch(updateList([]));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      dispatch(showAlert('조회 오류'));
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageItems = () => {
    const Last = currentPage * Page;
    const First = Last - Page;
    const sortedList = [...pageList].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return sortedList.slice(First, Last);
};

  const totalPages = Math.ceil(pageList.length / Page);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const search = () => {
    if (searchValue !== '') {
      const filteredList = pageList.filter((item) => item.title.replace(/\s/g, '').includes(searchValue.replace(/\s/g, '')));
      setPageList(filteredList);
    } else {
      getMenu();
    }
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <AdminHeader />
      <div className='board-wrap'>
        <div className='board-title'>
          <div id='SearchBox'>
            <input
              type='text'
              placeholder='페이지명'
              id='SearchContent'
              value={searchValue}
              onChange={handleInputChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  search();
                }
              }}
            />
            <button id='Search-btn' onClick={search}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
        <div className='board-list-wrap'>
          <div className='board-list'>
            <div className='top'>
              {contentList.map(({ id, content }) => (
                <div key={id} className='top_content'>
                  {content}
                </div>
              ))}
            </div>
            {getPageItems().length === 0 ? (
              <div className='not_found_wrap'>
                <div className='not_found_text'>
                  <h1>{searchValue}</h1> 페이지는 목록에 없습니다.
                </div>
              </div>
            ) : (
              getPageItems().map((menu) => <PageList key={menu.idx} menu={menu} parentList={parentList} setIsOpen={setIsOpen} dispatch={dispatch} />)
            )}
          </div>
        </div>
        <div className='board-page'>
          <button className='back_btn' disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            이전
          </button>
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} className={`back_btn ${pageNumber === currentPage ? 'active' : ''}`} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          ))}
          <button className='back_btn' disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            다음
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagement;

const contentList = [
  { id: '01', content: '페이지명' },
  { id: '02', content: '페이지 경로' },
  { id: '03', content: '메뉴' },
  { id: '04', content: '업데이트 일시' },
  { id: '05', content: '관리' },
];
