import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { showAlert, showConfirm, showToast, hideToast } from 'redux/AlertSlice';

// hooks
import { useEditorActions } from 'hooks/useEditor';

// 컴포넌트
import Block from 'components/Editor/Block';
import Nav from 'components/Main/Nav';
// import Spinner from 'components/Spinner/Spinner';
import Loading from 'components/Spinner/Loading';

// icon 및 css
import 'styles/Editor/Editor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faTabletScreenButton, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';

const Editor = ({ isLoading, setIsLoading }) => {
  const match = useMatch('/editor/*');
  const path = match.params['*'].split('/');
  const page_idx = path[path.length - 1];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { secondList } = useSelector((state) => state.menu);
  const blocks = useSelector((state) => state.editor.blockList);
  const [error, setError] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [blockStyle, setBlockStyle] = useState([]); // 블록 스타일 상태 값
  const [historyList, setHistoryList] = useState([]); // 히스토리 리스트
  const [showHistory, setShowHistory] = useState(false); // 히스토리 토글
  const [isWaiting, setIsWaiting] = useState(false); // 블록 추가, 삭제, 순서 변경 시 대기 상태
  const [originalData, setOriginalData] = useState([]); // db에서 가져온 원본 데이터

  const { getBlocksAction, insertBlockAction, deleteBlockAction, updateBlockOrderAction, saveBlockAction, changeMenuSaveTimeAction } = useEditorActions();

  useEffect(() => {
    // 블록 조회
    const getBlocks = async () => {
      await getBlocksAction(Number(page_idx), setIsLoading, setError, setBlockStyle, setHistoryList, setIsWaiting, setOriginalData);
    };
    getBlocks();
  }, [page_idx]);

  // 블록 추가
  const addBlock = async (order, dir) => {
    await insertBlockAction(Number(page_idx), order, dir, setIsLoading, setError, setIsWaiting);
  };

  // 블록 삭제
  const deleteBlock = (id) => {
    if (blocks.length === 1) {
      dispatch(showAlert('최소 한 개의 블록은 있어야 합니다.'));
      return;
    }
    dispatch(
      showConfirm({
        message: '해당 블록을 삭제하시겠습니까?',
        onConfirm: async () => {
          await deleteBlockAction(id, setIsLoading, setError, setIsWaiting);
        },
      }),
    );
  };

  // 블록 순서 변경
  const handleChangeBlockOrder = async (block_id, dir) => {
    await updateBlockOrderAction(block_id, dir, setIsLoading, setError, setIsWaiting);
  };

  // 사이즈 변경
  const handleScreenChange = (size) => {
    setScreenSize(size);
  };

  // 페이지 이동
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    dispatch(
      showConfirm({
        message: '저장 후 이동하시겠습니까?',
        onConfirm: async () => {
          try {
            // await saveBlockAction(page_idx, blocks, setIsLoading, setError);
            // dispatch(showToast({ message: '저장 되었습니다.', timer: 3000 }));
            navigate(`/editor/${selectedValue}`);
            // setTimeout(() => {

            // }, 3000);
          } catch {}
        },
        onCancel: () => {
          navigate(`/editor/${selectedValue}`);
        },
      }),
    );
  };

  // 미리보기
  const handlePreview = () => {
    dispatch(showAlert('미리보기'));
  };

  // 에디터 저장
  const handleSave = async () => {
    try {
      const isEqual = arrayEqual(blocks, originalData);
      if (!isEqual) {
        await saveBlockAction(page_idx, blocks, setIsLoading, setError, setHistoryList);
        dispatch(showToast({ message: '저장 되었습니다.', timer: 3000 }));
      } else {
        dispatch(showAlert('변경 내역이 없어 저장되지 않습니다.'));
      }
    } catch {}
  };

  // redux block 값이랑 db에서 가져온 원본 데이터랑 비교
  const arrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      const keys1 = Object.keys(arr1[i]);
      const keys2 = Object.keys(arr2[i]);

      if (keys1.length !== keys2.length) return false;

      for (let key of keys1) {
        if (arr1[i][key] !== arr2[i][key]) return false;
      }
    }
    return true;
  };

  // 블록 히스토리 값으로 변경하기
  const handleHistoryChange = async (history) => {
    dispatch(
      showConfirm({
        message: '해당 날짜의 데이터를 불러오시겠습니까?',
        onConfirm: async () => {
          try {
            await changeMenuSaveTimeAction(page_idx, history, setError, setIsWaiting);
            setShowHistory(false);
          } catch {
            dispatch(showAlert('히스토리 변경에 실패했습니다.'));
            setShowHistory(false);
          }
        },
        onCancel: () => {
          setShowHistory(false);
        },
      }),
    );
  };

  useEffect(() => {
    if (error) {
      dispatch(showAlert('에러', error));
      navigate(-1);
    }
  }, [error]);

  return (
    <>
      <div className='editor_wrap'>
        <div className='editor_pages_wrap'>
          <div className='editor_backup'>
            <button className='editor_open' onClick={() => setShowHistory(!showHistory)}>
              복원하기
            </button>
            <div className={`history-dropdown ${showHistory ? 'show' : ''}`}>
              {historyList.map((item, index) => (
                <button key={index} onClick={() => handleHistoryChange(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className='editor_pages'>
            <label className='editor_pageList_Label'>현재 페이지</label>
            <select className='editor_pageList' value={page_idx} onChange={handleSelectChange}>
              {secondList.map((item) => (
                <option key={item.title} value={item.idx}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className='editor_btns'>
            {/* <button className='editor_previewBtn' onClick={handlePreview}>
              미리보기
            </button> */}
            <button className='editor_saveBtn' onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
        <div className='editor_switch_screen'>
          {screenIcons.map(({ id, icon, size }) => (
            <button className='editor_switch_screen_Btn' key={id} onClick={() => handleScreenChange(size)}>
              <FontAwesomeIcon icon={icon} />
            </button>
          ))}
        </div>
      </div>
      <div className={screenSize}>
        <Nav isLoading={isLoading} setIsLoading={setIsLoading} screenSize={screenSize} type='편집' />
        <div style={{ marginBottom: '30px' }}>
          {[...blocks]
            .filter((e) => e.page_id === Number(page_idx))
            .sort((a, b) => a.block_order - b.block_order)
            .map((block) => (
              <div key={block.block_id}>
                <Block
                  block_id={block.block_id}
                  design_type={block.design_type}
                  design_id={block.design_id}
                  block_order={block.block_order}
                  layout_design={block.layout_design}
                  block_content={block.content}
                  addBlock={addBlock}
                  deleteBlock={deleteBlock}
                  handleChangeBlockOrder={handleChangeBlockOrder}
                  blockStyle={JSON.parse(block.block_style)}
                  screenSize={screenSize}
                />
              </div>
            ))}
        </div>
      </div>
      {isWaiting && <Loading />}
    </>
  );
};

export default Editor;

const screenIcons = [
  { id: '001', icon: faDesktop, size: 'desktop' },
  { id: '002', icon: faTabletScreenButton, size: 'tablet' },
  { id: '003', icon: faMobileScreenButton, size: 'mobile' },
];
