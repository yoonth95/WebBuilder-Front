import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/userSlice';
import { verifyTokenAPI } from 'api/User';

const useAuth = async (setIsLoading, setIsAuthenticated) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const userInfo = await verifyTokenAPI();
        console.log(userInfo)
        dispatch(setUser(userInfo));
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [dispatch]);
};  

export default useAuth;