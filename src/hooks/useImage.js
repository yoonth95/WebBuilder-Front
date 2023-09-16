import { useDispatch, useSelector } from 'react-redux';
import { updateList } from 'redux/editorSlice';

import { UploadImageAPI, DeleteImageAPI } from 'api/Image';

export const useImageActions = () => {
  const blocks = useSelector(state => state.editor.blockList);
  const dispatch = useDispatch();

  // 이미지 추가
  const addImageAction = async ({ tag, block_id, idx, isLayout, setProgress, location }) => {
    ////// 서버에 저장할 이미지 정보
    let formData = new FormData();
    const fileInfo = tag.target.files[0];
    const fileType = fileInfo.type.split('/')[1];
    const fileName = `${location.replaceAll('/', '_').slice(1)}_${new Date().getTime()}.${fileType}`;
    formData.append('image', tag.target.files[0], fileName);
    const url_path = await UploadImageAPI(formData, setProgress);
    // console.log(url_path);


    ////// Redux에 저장할 이미지 정보
    const updateImages = (images, src) => {
      console.log(src);
      if (idx === undefined) {
        return images.map(image => ({ ...image, src }));
      } else {
        return images.map((image, i) =>
          i === idx ? { ...image, src } : image
        );
      }
    }
    // 레이아웃 이미지 추가
    if (isLayout !== false) {
      const layout_id = Number(isLayout.split("_")[1]);
      const updatedBlocks = blocks.map(block => {
        if (block.block_id === block_id) {
          const updatedLayoutDesign = JSON.parse(block.layout_design).map(layout => {
            if (layout.layout_id === layout_id) {
              return {
                ...layout,
                boxes: {
                  ...layout.boxes,
                  images: updateImages(layout.boxes.images, url_path)
                }
              }
            }
            return layout;
          });

          return {
            ...block,
            layout_design: JSON.stringify(updatedLayoutDesign)
          };
        }
        return block;
      });
      console.log(updatedBlocks);
      dispatch(updateList(updatedBlocks));
    }
    // 레이아웃이 아닌 디자인 이미지 추가
    else {
      dispatch(updateList(blocks.map(block => {
        if (block.block_id === block_id) {
          return {
            ...block,
            content: {
              ...block.content,
              images: updateImages(block.content.images, url_path)
            }
          }
        }
        return block;
      })));
    }
    tag.target.value = '';
  }

  // 이미지 삭제
  const deleteImageAction = async ({ block_id, idx, isLayout }) => {
    // let src = '';
    // if (isLayout !== false) {
    //   const layout_id = Number(isLayout.split("_")[1]);
    //   if (idx === undefined) {
    //     src = JSON.parse(blocks.find(block => block.block_id === block_id).layout_design).find(layout => layout.layout_id === layout_id).boxes.images[0].src;
    //   } else {
    //     src = JSON.parse(blocks.find(block => block.block_id === block_id).layout_design).find(layout => layout.layout_id === layout_id).boxes.images[idx].src;
    //   }
    // } else {
    //   if (idx === undefined) {
    //     src = blocks.find(block => block.block_id === block_id).content.images[0].src;
    //   } else {
    //     src = blocks.find(block => block.block_id === block_id).content.images[idx].src;
    //   }
    // }
    // const result = await DeleteImageAPI(src);
    // console.log(result);

    const deleteImages = (images) => {
      if (idx === undefined) {
        return images.map(image => ({ ...image, src: '', href: '' }));
      } else {
        return images.map((image, i) =>
          i === idx ? { ...image, src: '', href: '' } : image
        );
      }
    }
    

    // 레이아웃 이미지 삭제
    if (isLayout !== false) {
      const layout_id = Number(isLayout.split("_")[1]);
      const updatedBlocks = blocks.map(block => {
        if (block.block_id === block_id) {
          const updatedLayoutDesign = JSON.parse(block.layout_design).map(layout => {
            if (layout.layout_id === layout_id) {
              return {
                ...layout,
                boxes: {
                  ...layout.boxes,
                  images: layout.boxes.images.map(image => {
                    if (image.src) {
                      return { ...image, src: '', href: '' };
                    }
                    return image;
                  })
                }
              }
            }
            return layout;
          });

          return {
            ...block,
            layout_design: JSON.stringify(updatedLayoutDesign)
          };
        }
        return block;
      });

      dispatch(updateList(updatedBlocks));
    }

    // 레이아웃이 아닌 디자인 이미지 삭제
    else {
      dispatch(updateList(blocks.map(block => {
        if (block.block_id === block_id) {
          return {
            ...block,
            content: {
              ...block.content,
              images: deleteImages(block.content.images)
            }
          }
        }
        return block;
      })));
    }
  }
  return { addImageAction, deleteImageAction };
};