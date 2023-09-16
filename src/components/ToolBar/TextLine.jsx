import React, { useEffect, useRef, useState } from 'react';
import ToolBar from './ToolBar';

const TextLine = ({ index, line, handleUpdateText, screenSize, maxWidth }) => {
  const [dragging, setDragging] = useState(false);
  const [blockToolbar, setBlockToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef(null);
  const parentRef = useRef(null);
  const [savedSelection, setSavedSelection] = useState(null);

  useEffect(() => {
    const handleDocumentMouseDown = (e) => {
      if (!blockToolbar) return;

      const target = e.target;
    
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setBlockToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [blockToolbar])

  const handleMouseDown = (e) => {
    setDragging(true);
    setBlockToolbar(false);
    const selection = window.getSelection();
    if (selection.rangeCount > 0) selection.removeAllRanges();
  };

  const handleMouseUp = (e) => {
    if (dragging) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const parentRect = parentRef.current.getBoundingClientRect();

      const relativeTop = rect.top - parentRect.top - rect.height;
      let middle = (rect.left + rect.right) / 2;
      
      const text = range.toString();
      if (text.length > 0) {
        if (middle - 115 < 0) middle = 134;
        else if (middle + 115 > window.innerWidth) middle = window.innerWidth - 140;
        setToolbarPosition({ x: middle - 130, y: relativeTop });
        setBlockToolbar(true);
        setSavedSelection(saveSelection())
      } else {
        setBlockToolbar(false);
      }
    }
  };

  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }
    return null;
  }

  const restoreSelection = (range) => {
    if (range && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  const handleStyleChange = (command) => {
    if (toolbarRef && toolbarRef.current) {
      // toolbarRef.current.focus();
      restoreSelection(savedSelection);  // 저장된 범위 복원
      document.execCommand(command, false, null);
    }
  };

  return (
    <React.Fragment>
      <div
        ref={parentRef}
        className='module_text_line textWidth'
        contentEditable={screenSize === 'desktop' ? true : false}
        suppressContentEditableWarning
        style={{ margin: line.margin, fontSize: line.fontSize, color: line.color, fontWeight: line.fontWeight, maxWidth: maxWidth }}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onBlur={(e) => handleUpdateText(index, e.target.innerHTML)}
        dangerouslySetInnerHTML={{ __html: line.text }}
      ></div>
      {blockToolbar && <ToolBar ref={toolbarRef} toolbarPosition={toolbarPosition} handleStyleChange={handleStyleChange}/>}
    </React.Fragment>
  );
};

export default TextLine;
