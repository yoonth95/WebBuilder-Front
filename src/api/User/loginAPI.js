export const loginAPI = async (id, pw) => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userID: id, userPW: pw }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data);
    }

    const data = await res.json();
    const userInfo = {
      user_idx: data.user_idx,
      user_id: data.user_id,
      user_name: data.user_name,
    };

    return userInfo;
  } catch (err) {
    console.error(err);
    throw err;
  }
};