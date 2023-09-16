export const verifyTokenAPI = async () => {
  try {
    const res = await fetch('/api/verifyToken', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      console.log('Error response text:', text);
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
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    throw err;
  }
};
