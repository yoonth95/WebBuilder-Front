export const signupAPI = async (name, id, pw) => {
  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userName: name, userID: id, userPW: pw }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data);
    }

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};