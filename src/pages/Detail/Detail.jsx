import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from 'components/Main/Nav';
import { GetBlocksAPI } from 'api/Editor';
import designType from 'data/designType';
import { DetailRenderBox } from 'components/Detail/DetailRenderBox';
import ApplyTable from 'components/Editor/ApplyTable';
import 'styles/Detail/Detail.css';

const Detail = ({ isLoading, setIsLoading, setError }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState(null);
  const { secondList } = useSelector((state) => state.menu);
  const { pathname } = useLocation();
  const link = pathname.split('pages/')[1];
  const user_idx = pathname.split('pages/')[0].split('main/')[1];
  const filterData = secondList.filter((item) => item.link === link)[0]?.idx;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blocks = await GetBlocksAPI(user_idx, filterData);
        setData(blocks);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchData();
  }, [filterData]);

  const renderBox = (block) => {
    const defaultStyle = {
      maxWidth: '1240px',
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: '#ffffff',
    };

    const arg = {
      content: block.content,
      block_id: block.block_id,
      blockStyle: JSON.parse(block.block_style) || defaultStyle,
      layout_design: block.layout_design,
    };

    return DetailRenderBox[block.design_type](arg);
  };

  return (
    <div className='detail_wrap'>
      <Nav isLoading={isLoading} setIsLoading={setIsLoading} windowWidth={windowWidth} />
      {data?.result
        ?.sort((a, b) => a.block_order - b.block_order)
        .filter((block) => block.design_type !== 'default')
        .map((block) => {
          if (block.design_type === 'table') {
            return (
              <div key={block.block_id} className='module_block'>
                <div className='normal_wrap' style={{ backgroundColor: '#ffffff' }}>
                  <div className='module_wrap' style={{ maxWidth: '1240px', paddingTop: '0px', paddingBottom: '0px' }}>
                    <div className='module_container'>
                      <ApplyTable design_id={block.design_id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={block.block_id} className='module_block'>
                {renderBox(block)}
              </div>
            );
          }
        })}
    </div>
  );
};

export default Detail;
