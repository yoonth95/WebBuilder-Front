import React, { forwardRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPalette } from '@fortawesome/free-solid-svg-icons';

const ToolBar = forwardRef(({ toolbarPosition, handleStyleChange }, ref) => {
//   function makeTextBold() {
//     const selection = window.getSelection();
//     if (!selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const span = document.createElement("span");
//     span.style.fontWeight = "bold";
//     range.surroundContents(span);
//     selection.removeAllRanges();
// }

  return (
    <div className='options' ref={ref} style={{ left: `${toolbarPosition.x}px`, top: `${toolbarPosition.y}px` }}>
      <button className='option_btn' onClick={() => handleStyleChange('bold')}>
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('italic')}>
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('underline')}>
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('justifyLeft')}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('justifyCenter')}>
        <FontAwesomeIcon icon={faAlignCenter} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('justifyRight')}>
        <FontAwesomeIcon icon={faAlignRight} />
      </button>
      <button className='option_btn' onClick={() => handleStyleChange('justifyFull')}>
        <FontAwesomeIcon icon={faAlignJustify} />
      </button>
    </div>
  );
});

export default ToolBar;
