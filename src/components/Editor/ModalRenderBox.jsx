import 'styles/Editor/Block.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export const ModalRenderBox = {
  image: (box, index, designSelectId, selectedId) => {
    const isSelected = selectedId === box.id;
    return (
      <div key={index} className='typeBox' onClick={() => designSelectId(box.id)} style={{ border: isSelected ? '2px solid #ee7d00' : '' }}>
        <div className='parentBox' style={box.layout}>
          {[...Array(box.images.length)].map((_, i) => {
            const shape = box.images[i].shape === 'circle' ? '50%' : '0%';
            return (
              <div key={i} style={{ borderRadius: shape }} className='imageBox'>
                <FontAwesomeIcon icon={faImage} />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  line: (box, index, designSelectId, selectedId) => {
    const isSelected = selectedId === box.id;
    return (
      <div
        key={index}
        className='typeBox'
        style={{ height: '96px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: isSelected ? '2px solid #ee7d00' : '' }}
        onClick={() => designSelectId(box.id)}
      >
        <div style={box.style}></div>
      </div>
    );
  },
  list: (box, index, designSelectId, selectedId) => {
    const isSelected = selectedId === box.id;
    return (
      <div key={index} className='typeBox listBox font-style' onClick={() => designSelectId(box.id)} style={{ border: isSelected ? '2px solid #ee7d00' : '' }}>
        <div className={`listImage ${box.shape}`}>
          <FontAwesomeIcon icon={faImage} />
        </div>
        {box.hasTitle && <p className='title'>제목</p>}
        {box.hasTitleColor && <p className='titleColor'>색깔 있는 제목</p>}
        {box.hasSubtitle && <p className='subtitle'>주 1회 / 과목당 10분</p>}
        {box.hasText && <p className='text'>초단기한글</p>}
        {box.hasTinyText && <p className='tinyText'>학습관리 및 상담</p>}
        {box.hasDetails && (
          <p className='details'>
            친구들과 함께 모여 교과 과정에 필요한 핵심 과목을 <br />
            집중적으로 관리 받습니다. 전문 선생님의 학습 관리로 자기주도 <br />
            학습을 성장시킬 수 있습니다.
          </p>
        )}
        {box.hasContent && (
          <p className='content'>
            북패드 디지털 콘텐츠를 활용하여 <br />
            학생들의 지면 학습을 더욱 심도 깊고 <br />
            쉽게 이해하여 기본 개념을 탄탄하게 합니다.
          </p>
        )}
      </div>
    );
  },
  text: (box, index, designSelectId, selectedId) => {
    const isSelected = selectedId === box.id;
    return (
      <div key={index} className='typeBox' onClick={() => designSelectId(box.id)} style={{ border: isSelected ? '2px solid #ee7d00' : '' }}>
        <div className='textBox' style={{ textAlign: `${box.alignments}` }}>
          {box.lines.map((line, i) => (
            <p key={i} style={{ margin: line.margin, fontSize: line.fontSize, color: line.color, fontWeight: line.fontWeight }}>
              {line.text}
              {line.button && <button className={line.buttonStyle}>{line.button}</button>}
            </p>
          ))}
        </div>
      </div>
    );
  },
  table: null,
  layout: (box, index, designSelectId, selectedId) => {
    const isSelected = selectedId === box.id;

    const renderElement = (element) => {
      const keyForElement = element.layout_id || Math.random().toString();

      if (element.children) {
        return (
          <div key={keyForElement} style={element.style}>
            {element.children.map((child) => renderElement(child))}
          </div>
        );
      } else {
        return <div key={keyForElement} className='layoutBox' style={element.style}></div>;
      }
    };

    return (
      <div key={index} className='typeBox' style={{ ...box.style, gap: '10px', border: isSelected ? '2px solid #ee7d00' : '' }} onClick={() => designSelectId(box.id)}>
        {box.elements.map((element) => renderElement(element))}
      </div>
    );
  },
  // 필요한 만큼 추가
};
