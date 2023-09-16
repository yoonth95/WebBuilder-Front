import React from 'react';
import { useLocation } from 'react-router-dom';

import Management from 'components/Management/Management';
import Pagement from 'components/Pagement/Pagement';

const Admin = ({ setIsOpen, isLoading, setIsLoading }) => {
  const query = new URLSearchParams(useLocation().search);
  const tab = query.get('tab');

  return (
    <div className='admin'>
      {tab === 'a' ? <Management setIsOpen={setIsOpen} setIsLoading={setIsLoading} isLoading={isLoading} /> : <Pagement setIsOpen={setIsOpen} setIsLoading={setIsLoading} isLoading={isLoading} />}
    </div>
  );
};

export default Admin;
