export const GetMenuAPI = async (isIdx, userID) => {
  try {
    let user_id = userID;

    if (isIdx) {
      const res = await fetch(`/api/getUserId/${userID}`, { method: 'GET', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data);
      user_id = data[0].userID;
    }

    const res = await fetch(`/api/getMenu/${user_id}`, { method: 'GET', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};