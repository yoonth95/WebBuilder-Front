export const verifyTokenAPI = async () => {
  try {
    const res = await fetch('/api/verifyToken', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      console.log('no token');
      throw new Error('No token');
    }

    const data = await res.json();
    const userInfo = {
      user_idx: data.user.user_idx,
      user_id: data.user.userID,
      user_name: data.user.userName,
    };

    return userInfo;
  } catch (err) {
    console.error(err);
    throw err;
  }
};