export const UpdateBlockOrderAPI = async (block_id, block_order) => {
  try {
    const res = await fetch('/api/orderBlock', {
      method: 'PUT',
      body: JSON.stringify({block_id, block_order}),
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