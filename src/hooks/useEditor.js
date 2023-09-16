import { Navigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { updateList } from 'redux/editorSlice';
import { showAlert } from 'redux/AlertSlice';
import designType from 'data/designType';

import {
  GetBlocksAPI,
  InsertBlockAPI,
  UpdateBlockOrderAPI,
  UpdateBlockDesignAPI,
  DeleteBlockAPI,
  UpdateBlockLayoutAPI,
  SaveBlockAPI,
  CopyDeisgnAPI,
  ChangeMenuSaveTimeAPI
} from '../api/Editor';

export const useEditorActions = () => {
  const blocks = useSelector(state => state.editor.blockList);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // 에디터 블록 조회
  const getBlocksAction = async (page_idx, setIsLoading, setError, setBlockStyle, setHistoryList, setIsWaiting, setOriginalData) => {
    try {
      setIsLoading(true);
      setIsWaiting(true);
      const data = await GetBlocksAPI(user.user_idx, page_idx);

      if (data === null) {
        Navigate('/notfound');
      } else {
        if (data.result.length === 0) {
          const block_id = `${page_idx}_${new Date().getTime()}_${Math.floor(Math.random() * 899999) + 100000}`;
          const block_style = {
            style: {
              maxWidth: "1240px",
              paddingTop: "0px",
              paddingBottom: "0px",
              backgroundColor: "revert",
            },
            block_id: block_id,
          }
          const newBlock = {
            page_id: page_idx,
            block_id: block_id,
            block_style: JSON.stringify(block_style),
            design_type: 'default',
            design_id: '0',
            layout_design: null,
            content: null,
            block_order: 1
          };

          dispatch(updateList([newBlock]))
          await InsertBlockAPI(newBlock);
          setIsLoading(false);
          setIsWaiting(false);
        } else {
          let blockList = [];
          if (blocks && blocks.length > 0) {
            blockList = [...blocks];
          }
          const saveData = [];
          data.result.forEach(block => {
            if (block.save_data) saveData.push(block.save_date);
            if (!blockList.find(b => b.block_id === block.block_id)) {
              blockList.push(block);

              if (block.block_style === null) {
                const block_dic = {
                  style: {
                    maxWidth: "1240px",
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    backgroundColor: "revert",
                  },
                  block_id: block.block_id,
                }
                setBlockStyle(item => [...item, block_dic]);
              } else {
                const block_style = JSON.parse(block.block_style);
                setBlockStyle(item => [...item, block_style]);
              }
            }
          });
          setOriginalData(blockList);
          dispatch(updateList(blockList));

          if (data.save_time) {
            // save_time 중복 제거
            const saveTime = data.save_time.map(item => {
              return Object.values(item)[0];
            });
            const dupSaveData = [...new Set(saveTime)];
            setHistoryList(dupSaveData);
          }
          setIsLoading(false);
          setIsWaiting(false);
        }
      }
    } catch (err) {
      console.error(err.message);
      setError(err);
      setIsLoading(false);
      setIsWaiting(false);
    }
  }
  // 테이블 셀별 수정.
  const updateTableDataInBlock = (block_id, col, row, content) => {
    return blocks.map(block => {
      if (block.block_id === block_id) {
        const existingRows = block.content?.rows || [];
        const updatedRows = [...existingRows];

        const updatedRow = { ...updatedRows[row] };
        updatedRow[col] = content;
        updatedRows[row] = updatedRow;

        return {
          ...block,
          content: {
            ...(block.content || {}),
            rows: updatedRows
          }
        };
      }
      return block;
    });
  };



  // 블록 추가
  const insertBlockAction = async (page_idx, order, dir, setIsLoading, setError, setIsWaiting) => {
    const block_id = `${page_idx}_${new Date().getTime()}_${Math.floor(Math.random() * 899999) + 100000}`;
    const block_style = {
      style: {
        maxWidth: "1240px",
        paddingTop: "0px",
        paddingBottom: "0px",
        backgroundColor: "revert",
      },
      block_id: block_id,
    }
    const newBlock = {
      page_id: page_idx,
      block_id: block_id,
      block_style: JSON.stringify(block_style),
      design_type: 'default',
      design_id: '0',
      layout_design: null,
      content: null,
      block_order: dir === 'after' ? order + 1 : order
    };

    try {
      setIsLoading(true);
      setIsWaiting(true);
      const updatedBlocks = blocks.map(block => {
        if (block.block_order >= newBlock.block_order) {
          return { ...block, block_order: block.block_order + 1 }
        }
        return block;
      });

      for (const updateBlock of updatedBlocks) {
        if (blocks.find(block => block.block_id === updateBlock.block_id).block_order !== updateBlock.block_order) {
          await UpdateBlockOrderAPI(updateBlock.block_id, updateBlock.block_order);
        }
      }

      await InsertBlockAPI(newBlock);

      let blockList = [];
      if (updatedBlocks && updatedBlocks.length > 0) {
        blockList = [...updatedBlocks];
      }
      blockList.push(newBlock);
      dispatch(updateList(blockList));
    } catch (err) {
      console.error(err.message);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
    }
  };

  // 블록 디자인 수정
  const updateBlockDesignAction = async (block_id, design_type, design_id) => {
    try {
      let content;
      if (design_type === 'table') {
        content = null;
        await UpdateBlockDesignAPI(block_id, design_type, design_id, content);
      } else {
        content = designType.find(type => type.type === design_type).boxes.find(box => box.id === design_id);
        const JsonToBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(content))));
        await UpdateBlockDesignAPI(block_id, design_type, design_id, JsonToBase64);
      }

      dispatch(updateList(blocks.map(block => {
        if (block.block_id === block_id) {
          return { ...block, design_type: design_type, design_id: design_id, content: content }
        }
        return block;
      })));
    } catch (err) {
      console.error(err.message);
    }
  };

  // 블록 텍스트 수정
  const handleUpdateText = (block_id, line_idx, updatedText, isLayout) => {
    // 레이아웃이 아닐 때
    if (!isLayout) {
      const updateBlock = blocks?.map((block) => {
        if (block.block_id === block_id) {
          const updateLine = block.content?.lines?.map((e, idx) => {
            if (idx === line_idx) {
              return {
                ...e,
                text: updatedText
              }
            } else return e
          });
          return { ...block, content: { ...block.content, lines: updateLine } }
        }
        return block;
      });
      dispatch(updateList(updateBlock));
    }
    // 레이아웃일 때
    else {
      const layout_id = Number(isLayout.split("_")[1]);

      const updateBlock = blocks?.map((block) => {
        if (block.block_id === block_id) {
          const StringToJson = JSON.parse(block.layout_design);
          const updateLayout = StringToJson?.map(e => {
            if (e.layout_id === layout_id) {
              const updateLine = e.boxes?.lines?.map((e, idx) => {
                if (idx === line_idx) {
                  return {
                    ...e,
                    text: updatedText
                  }
                } else return e
              });
              return { ...e, boxes: { ...e.boxes, lines: updateLine } }
            } else return e
          });

          return { ...block, layout_design: JSON.stringify(updateLayout) }
        }
        return block;
      });
      dispatch(updateList(updateBlock));
    }
  };


  // 블록 삭제
  const deleteBlockAction = async (block_id, setIsLoading, setError, setIsWaiting) => {
    const blockToDelete = blocks.find(block => block.block_id === block_id);
    if (!blockToDelete) {
      throw new Error('Block not found');
    }

    try {
      setIsLoading(true);
      setIsWaiting(true);

      let error = false;
      const result = await DeleteBlockAPI(block_id);
      if (!result) {
        error = true;
      }

      const updatedBlocks = blocks.map(block => {
        if (block.block_order > blockToDelete.block_order) {
          return { ...block, block_order: block.block_order - 1 }
        }
        return block;
      });

      for (const updateBlock of updatedBlocks) {
        if (blocks.find(block => block.block_id === updateBlock.block_id).block_order !== updateBlock.block_order) {
          const result2 = await UpdateBlockOrderAPI(updateBlock.block_id, updateBlock.block_order);
          if (!result2) {
            error = true;
          }
        }
      }

      if (!error) dispatch(updateList(updatedBlocks.filter(block => block.block_id !== block_id)));

    } catch (err) {
      console.error(err.message);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
    }
  };

  // 블록 순서 수정
  const updateBlockOrderAction = async (block_id, dir, setIsLoading, setError, setIsWaiting) => {
    try {
      setIsLoading(true);
      setIsWaiting(true);
      const blockToMoveIndex = blocks.findIndex(block => block.block_id === block_id);
      if (blockToMoveIndex === -1) {
        throw new Error('Block not found');
      }

      let newBlocks = [...blocks];
      let blockToMove = { ...newBlocks[blockToMoveIndex] };

      // 블록을 위로 올릴 때
      if (dir === 'up' && blockToMove.block_order > 1) {
        const blockAboveIndex = newBlocks.findIndex(block => block.block_order === blockToMove.block_order - 1);
        const blockAbove = { ...newBlocks[blockAboveIndex] };

        blockAbove.block_order += 1;
        blockToMove.block_order -= 1;

        // 서버에 블록 순서 업데이트
        await Promise.allSettled([
          UpdateBlockOrderAPI(blockToMove.block_id, blockToMove.block_order),
          UpdateBlockOrderAPI(blockAbove.block_id, blockAbove.block_order)
        ]);

        newBlocks[blockToMoveIndex] = blockToMove;
        newBlocks[blockAboveIndex] = blockAbove;
      }

      // 블록을 아래로 내릴 때
      if (dir === 'down' && blockToMove.block_order < newBlocks.length) {
        const blockBelowIndex = newBlocks.findIndex(block => block.block_order === blockToMove.block_order + 1);
        let blockBelow = { ...newBlocks[blockBelowIndex] };

        blockBelow.block_order -= 1;
        blockToMove.block_order += 1;

        // 서버에 블록 순서 업데이트
        await Promise.all([
          UpdateBlockOrderAPI(blockToMove.block_id, blockToMove.block_order),
          UpdateBlockOrderAPI(blockBelow.block_id, blockBelow.block_order)
        ]);

        // 새로운 상태를 Redux store에 반영
        newBlocks[blockToMoveIndex] = blockToMove;
        newBlocks[blockBelowIndex] = blockBelow;
      }

      // Redux 상태 업데이트
      newBlocks.sort((a, b) => a.block_order - b.block_order);
      dispatch(updateList(newBlocks));
    } catch (err) {
      console.error(err.message);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
    }
  };

  // 블록 레이아웃 수정
  const updateBlockLayoutAction = async (block_id, design_type, design_id, layout_id, boxes) => {
    try {
      const layout_design = {
        layout_id: layout_id,
        design_type: design_type,
        design_id: design_id,
        boxes: boxes
      };

      await UpdateBlockLayoutAPI(block_id, layout_design);
      dispatch(updateList(blocks.map(block => {
        if (block.block_id === block_id) {
          const existing_layout_design = JSON.parse(block.layout_design || '[]');
          existing_layout_design.push(layout_design);
          return { ...block, layout_design: JSON.stringify(existing_layout_design) }
        }
        return block;
      })));
    } catch (err) {
      console.error(err.message);
    }
  };

  // 블록 저장
  const saveBlockAction = async (page_idx, blocks, setIsLoading, setError, setHistoryList) => {
    try {
      setIsLoading(true);
      // const save_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // const srcList = [];
      const blockToBase64 = blocks.map(block => {
        // if (block.design_type === 'image' || block.design_type === 'list') {
        //   block.content.images.forEach(image => {if (image.src !== '') srcList.push(image.src)});
        // } else if (block.design_type === 'layout') {
        //   JSON.parse(block.layout_design).forEach(layout => {
        //     layout.boxes.images.forEach(image => {
        //       if (image.src !== '') srcList.push(image.src);
        //     });
        //   });
        // }

        const content = block.content
          ? btoa(unescape(encodeURIComponent(JSON.stringify(block.content))))
          : null;

        const layout_design = block.layout_design
          ? btoa(unescape(encodeURIComponent(block.layout_design)))
          : null;

        return {
          ...block,
          layout_design: layout_design,
          content: content
        };
      });
      const offset = 1000 * 60 * 60 * 9
      const koreaNow = new Date((new Date()).getTime() + offset)
      const save_time = koreaNow.toISOString().replace("T", " ").split('.')[0];

      const result = await SaveBlockAPI(page_idx, blockToBase64, save_time);
      setHistoryList(prev => [save_time, ...prev]);

      return result;
    } catch (err) {
      console.error(err.message);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  // 블록 복제
  const designCopyAction = async (sourcePage, targetPage, setIsOpen, reset) => {
    await CopyDeisgnAPI(sourcePage, targetPage);
    dispatch(showAlert('디자인 복제 완료'));
    setIsOpen(false);
    reset();
  }

  // menu 테이블 save_time 변경
  const changeMenuSaveTimeAction = async (page_idx, save_time, setError, setIsWaiting) => {
    try {
      setIsWaiting(true)
      const changeData = await ChangeMenuSaveTimeAPI(page_idx, save_time);
      dispatch(updateList(changeData));
    } catch (err) {
      setError(err);
      console.error(err.message);
    } finally {
      setIsWaiting(false);
    }
  }

  return { getBlocksAction, insertBlockAction, updateBlockDesignAction, deleteBlockAction, updateBlockOrderAction, updateBlockLayoutAction, saveBlockAction, handleUpdateText, designCopyAction, updateTableDataInBlock, changeMenuSaveTimeAction };
};