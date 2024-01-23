export const GetMenuAPI = async (isIdx, userID) => {
  try {
    let user_id = userID;

    if (isIdx) {
      const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/getUserId/${userID}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '69420' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data);
      user_id = data[0].userID;
    }

    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/getMenu/${user_id}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '69420' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
