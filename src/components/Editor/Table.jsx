import React, { useState, useEffect } from 'react';
import 'styles/Editor/Table.css';
import PropTypes from 'prop-types';


const TableCell = ({ onClick, onMouseEnter, row, col, tableRange, previewRange, activeCell, onReleaseClick }) => {
  const [color, setColor] = useState('white');
  const [borderColor, setBorderColor] = useState('black');
  const [borderStyle, setBorderStyle] = useState('dashed');
  

  useEffect(() => {
    if (activeCell && row === activeCell[0] && col === activeCell[1]) { // 셀 활성화 시 스타일
      setColor('#FFEBD6');
      setBorderColor('#EE7D00');
      setBorderStyle('solid');
    } else if (row <= previewRange[0] && col <= previewRange[1]) { // 셀 마우스 올려 있을 시 스타일
      setColor('#FFEBD6');
      setBorderColor('#EE7D00');
      setBorderStyle('solid');
    } else { // 그 외
      setColor('white');
      setBorderColor('black');
      setBorderStyle('dashed');
    }
  }, [tableRange, previewRange, activeCell]);

  // '해제' 버튼을 누를 때 함수
  const handleButtonClick = (e) => {
    e.stopPropagation();
    console.log('버튼 클릭');
    onReleaseClick(); // 부모 컴포넌트로 전달
  };

  return (
    <td
      style={{ backgroundColor: color, borderColor: borderColor, borderStyle: borderStyle, cursor: 'pointer', verticalAlign: 'middle', textAlign: 'center' }}
      onClick={() => {
        if (!activeCell) {
          onClick(row, col);
        }
      }}
      onMouseEnter={() => {
        onMouseEnter(row, col);
      }}
    >
      {(activeCell && row === activeCell[0] && col === activeCell[1]) && (
        <button onClick={handleButtonClick} className='cancle-btn'>
          해제
        </button>
      )}
    </td>
  );
};

TableCell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  tableRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  previewRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeCell: PropTypes.arrayOf(PropTypes.number),
};

const Table = ({ rows, cols, activeCell, setActiveCell }) => {
  const [tableRange, setTableRange] = useState([0, 0]);
  const [previewRange, setPreviewRange] = useState([0, 0]);
  

  const onCellMouseEnter = (i, j) => {
    if (!activeCell) {
      setPreviewRange([i, j]);
    }
  };

  const onCellClick = (i, j) => {
    setTableRange([i, j]);
    setActiveCell([i, j]);
  };

  const handleReleaseClick = () => {
    setActiveCell(null);
  };

  return (
    <div className='table_wrap'>
      <p>
        {previewRange[0] + 1} X {previewRange[1] + 1} 표
      </p>
      <table>
        <tbody>
          {Array(rows)
            .fill()
            .map((_, i) => (
              <tr key={i}>
                {Array(cols)
                  .fill()
                  .map((_, j) => (
                    <TableCell
                      key={j}
                      onClick={onCellClick}
                      row={i}
                      col={j}
                      onMouseEnter={onCellMouseEnter}
                      tableRange={tableRange}
                      previewRange={previewRange}
                      activeCell={activeCell}
                      onReleaseClick={handleReleaseClick}
                    />
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

Table.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  activeCell: PropTypes.arrayOf(PropTypes.number),
  setActiveCell: PropTypes.func.isRequired,
};