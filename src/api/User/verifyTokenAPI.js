export const verifyTokenAPI = async () => {
  try {
    const res = await fetch('/api/verifyToken', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '69420' },
      credentials: 'include',
    });

    const text = await res.text();
    console.log('Response text:', text);

    if (!res.ok) {
      throw new Error('No token');
    }

    try {
      const data = JSON.parse(text);
      const userInfo = {
        user_idx: data.user.user_idx,
        user_id: data.user.userID,
        user_name: data.user.userName,
      };

      return userInfo;
    } catch (err) {
      console.error('JSON parse error:', err);
      throw new Error('Invalid JSON response');
    }
  } catch (err) {
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    throw err;
  }
};