import React from 'react';
import ApplyTable from 'components/Editor/ApplyTable';
import 'styles/Detail/Detail.css';

export const DetailRenderBox = {
  image: ({ content, block_id, blockStyle }) => {
    let backgroundColor = 'revert';
    let restOfStyles = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
    };
    if (blockStyle) {
      restOfStyles = {
        maxWidth: blockStyle.style.maxWidth,
        paddingTop: blockStyle.style.paddingTop,
        paddingBottom: blockStyle.style.paddingBottom,
      };
      backgroundColor = blockStyle.style.backgroundColor || backgroundColor;
    }

    return (
      <div className='defaultPadding'>
        <div key={block_id} className='normal_wrap' style={{ backgroundColor: backgroundColor }}>
          <div className='module_wrap' style={restOfStyles}>
            <div className='module_container' style={content?.layout}>
              {[...Array(content?.images.length)].map((_, i) => {
                let shape = '';
                if (content?.images[i].shape === 'circle') {
                  shape = '50%';
                }
                return (
                  <div className='module_item' key={i} style={{ borderRadius: shape }}>
                    <div className='module_imageBox'>
                      <img
                        src={`${content?.images[i].src}`}
                        alt=''
                        style={content?.images[i].href !== '' ? { cursor: 'pointer', borderRadius: shape } : { cursor: '', borderRadius: shape }}
                        onClick={() => {
                          if (content?.images[i].href) {
                            window.location.href = content?.images[i].href;
                          }
                        }}
                        loading='lazy'
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
  line: ({ content, block_id, blockStyle }) => {
    let backgroundColor = 'revert';
    let restOfStyles = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
    };
    if (blockStyle) {
      restOfStyles = {
        maxWidth: blockStyle.style.maxWidth,
        paddingTop: blockStyle.style.paddingTop,
        paddingBottom: blockStyle.style.paddingBottom,
      };
      backgroundColor = blockStyle.style.backgroundColor || backgroundColor;
    }

    return (
      <div key={block_id} className='normal_wrap' style={{ backgroundColor: backgroundColor }}>
        <div className='module_wrap' style={restOfStyles}>
          <div className='module_container_line_detail'>
            <div style={content?.style}></div>
          </div>
        </div>
      </div>
    );
  },
  list: ({ content, block_id, blockStyle }) => {
    let backgroundColor = 'revert';
    let restOfStyles = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
    };
    if (blockStyle) {
      restOfStyles = {
        maxWidth: blockStyle.style.maxWidth,
        paddingTop: blockStyle.style.paddingTop,
        paddingBottom: blockStyle.style.paddingBottom,
      };
      backgroundColor = blockStyle.style.backgroundColor || backgroundColor;
    }

    return (
      <div key={block_id} className='normal_wrap' style={{ backgroundColor: backgroundColor }}>
        <div className='module_wrap font-style' style={restOfStyles}>
          <div className='module_container_list'>
            <div className='module_list_item'>
              <div className={`module_${content?.shape}_detail`} style={content?.images[0].href !== '' ? { cursor: 'pointer' } : { cursor: '' }}>
                <img
                  src={`${content?.images[0].src}`}
                  alt=''
                  style={content?.style}
                  onClick={() => {
                    if (content?.images[0].href) {
                      window.location.href = content?.images[0].href;
                    }
                  }}
                  loading='lazy'
                />
              </div>
              {content?.lines &&
                content?.lines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    style={{ margin: line.margin, fontFamily: line.fontFamily || 'inherit', fontSize: line.fontSize, fontWeight: line.fontWeight, color: line.color }}
                    className={`${line.className} textWidth ck-content`}
                    dangerouslySetInnerHTML={{ __html: line.text }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
  text: ({ content, block_id, blockStyle }) => {
    let backgroundColor = 'revert';
    let restOfStyles = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
    };
    if (blockStyle) {
      restOfStyles = {
        maxWidth: blockStyle.style.maxWidth,
        paddingTop: blockStyle.style.paddingTop,
        paddingBottom: blockStyle.style.paddingBottom,
      };
      backgroundColor = blockStyle.style.backgroundColor || backgroundColor;
    }
    return (
      <div key={block_id} className='normal_wrap' style={{ backgroundColor: backgroundColor }}>
        <div className='module_wrap' style={restOfStyles}>
          <div className='module_container' style={{ textAlign: `${content?.alignments}` }}>
            <div className='module_text_item'>
              {content?.lines.map((line, i) => (
                <React.Fragment key={i}>
                  <div
                    key={i}
                    className='module_text_line textWidth ck-content'
                    style={{ margin: line.margin, fontSize: line.fontSize, color: line.color, fontWeight: line.fontWeight }}
                    dangerouslySetInnerHTML={{ __html: line.text }}
                  ></div>
                  {line.button && <button className={line.buttonStyle}>{line.button}</button>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
  table: null,
  layout: ({ content, block_id, blockStyle, layout_design }) => {
    let backgroundColor = 'revert';
    let restOfStyles = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
    };
    if (blockStyle) {
      restOfStyles = {
        maxWidth: blockStyle.style.maxWidth,
        paddingTop: blockStyle.style.paddingTop,
        paddingBottom: blockStyle.style.paddingBottom,
      };
      backgroundColor = blockStyle.style.backgroundColor || backgroundColor;
    }

    const parsed_layout_design = layout_design ? JSON.parse(layout_design) : null;
    return (
      <div key={block_id} className='normal_wrap' style={{ backgroundColor: backgroundColor }}>
        <div className='module_wrap' style={restOfStyles}>
          <div className={`module_container`}>
            <div className='module_layout_item' style={content?.style}>
              {content?.elements.map((element, i) => renderContent(element, block_id, parsed_layout_design, DetailRenderBox))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

const renderContent = (element, block_id, parsed_layout_design, DetailRenderBox) => {
  const layout = parsed_layout_design && parsed_layout_design.find((e) => e.layout_id === element.layout_id);
  const layout_design_type = layout && layout.design_type;
  const layout_boxes = layout && layout.boxes;

  let boxes, index, tableDesignId;
  if (layout_design_type !== 'table') {
    boxes = layout_boxes ? layout_boxes : undefined;
    index = `${block_id}/layout_${element.layout_id}`;
  } else {
    tableDesignId = layout && layout.design_id;
  }

  const keyForElement = element.layout_id || Math.random().toString();

  if (element.children) {
    return (
      <div key={keyForElement} className={element.children ? '' : layout ? '' : 'module_layoutBox'} style={element.style}>
        {element.children.map((child, j) => renderContent(child, block_id, parsed_layout_design, DetailRenderBox))}
      </div>
    );
  } else {
    return (
      <div key={keyForElement} className={layout ? '' : 'module_layoutBox'} style={element.style}>
        {layout ? (
          layout_design_type === 'image' ? (
            DetailRenderBox.image({ content: boxes, block_id: index })
          ) : layout_design_type === 'text' ? (
            DetailRenderBox.text({ content: boxes, block_id: index })
          ) : layout_design_type === 'list' ? (
            DetailRenderBox.list({ content: boxes, block_id: index })
          ) : layout_design_type === 'table' ? (
            <ApplyTable design_id={tableDesignId} />
          ) : layout_design_type === 'line' ? (
            DetailRenderBox.line({ content: boxes, block_id: index })
          ) : null
        ) : null}
      </div>
    );
  }
};

DetailRenderBox.defaultProps = {
  blockStyle: [],
};
