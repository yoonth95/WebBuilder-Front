export const SaveBlockAPI = async (page_idx, blocks, save_time) => {
  try {
    const res = await fetch('/api/saveBlock', {
      method: 'PUT',
      body: JSON.stringify({page_idx, blocks, save_time}),
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