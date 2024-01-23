export const OrderMenuAPI = async (listData) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/orderMenu`, {
      method: 'PUT',
      body: JSON.stringify({ listData }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
