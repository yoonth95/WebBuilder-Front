import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useSelector, useDispatch } from 'react-redux';
import { updateList } from 'redux/editorSlice';

const TextEditor = ({ line, index, handleUpdateText, block_id, isLayout, screenSize }) => {
  const blocks = useSelector((state) => state.editor.blockList);
  const dispatch = useDispatch();

  const [editor, setEditor] = useState(null);

  const isWrappedWithPTag = (text) => {
    if (text.startsWith('<p')) return true;
    return false;
  };

  const editorData = isWrappedWithPTag(line.text) ? line.text : `<p style="text-align: ${line.textAlign};">${line.text}</p>`;

  const handleEditorReady = (editor) => {
    setEditor(editor);
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    // handleUpdateText(block_id, index, data, isLayout);

    if (line.text !== data) {
      if (!isLayout) {
        const updateBlock = blocks?.map((block) => {
          if (block.block_id === block_id) {
            const updateLine = block.content?.lines?.map((e, idx) => {
              if (idx === index) {
                return {
                  ...e,
                  text: data,
                };
              } else return e;
            });
            return { ...block, content: { ...block.content, lines: updateLine } };
          }
          return block;
        });
        dispatch(updateList(updateBlock));
      }
      // 레이아웃일 때
      else {
        const layout_id = Number(isLayout.split('_')[1]);

        const updateBlock = blocks?.map((block) => {
          if (block.block_id === block_id) {
            const StringToJson = JSON.parse(block.layout_design);
            const updateLayout = StringToJson?.map((e) => {
              if (e.layout_id === layout_id) {
                const updateLine = e.boxes?.lines?.map((e, idx) => {
                  if (idx === index) {
                    return {
                      ...e,
                      text: data,
                    };
                  } else return e;
                });
                return { ...e, boxes: { ...e.boxes, lines: updateLine } };
              } else return e;
            });

            return { ...block, layout_design: JSON.stringify(updateLayout) };
          }
          return block;
        });
        dispatch(updateList(updateBlock));
      }
    }
  };

  return (
    <div style={{ margin: line.margin, fontSize: line.fontSize, color: line.color, fontWeight: line.fontWeight, width: '100%' }}>
      <CKEditor
        style={{ margin: line.margin, fontSize: line.fontSize, color: line.color, fontWeight: line.fontWeight, textAlign: line.textAlign }}
        editor={ClassicEditor}
        config={{
          // plugins: [Font],
          toolbar: {
            items: ['heading', '|', 'fontSize', 'fontFamily', 'bold', 'italic', '|', 'alignment', '|', '|', 'indent', 'outdent', '|', 'fontBackgroundColor', 'fontColor', '|', 'undo', 'redo'],
            fontSize: {
              options: [
                'default',
                {
                  title: '6',
                  model: '6px',
                  view: {
                    name: 'span',
                    styles: { 'font-size': '12px' },
                  },
                },
                {
                  title: '8',
                  model: '8px',
                  view: {
                    name: 'span',
                    styles: { 'font-size': '12px' },
                  },
                },
                {
                  title: '40',
                  model: '40px',
                  view: {
                    name: 'span',
                    styles: { 'font-size': '12px' },
                  },
                },
                {
                  title: '72',
                  model: '72px',
                  view: {
                    name: 'span',
                    styles: { 'font-size': '12px' },
                  },
                },
                {
                  title: '100',
                  model: '100px',
                  view: {
                    name: 'span',
                    styles: { 'font-size': '12px' },
                  },
                },
              ],
              supportAllValues: true,
            },
            shouldNotGroupWhenFull: true,
          },
        }}
        data={editorData}
        // onReady={handleEditorReady}
        onBlur={handleEditorChange}
      />
    </div>
  );
};

export default TextEditor;
