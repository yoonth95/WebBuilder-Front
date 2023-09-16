export const InsertBlockAPI = async (newBlock) => {
  try {
    const res = await fetch('/api/insertBlock', {
      method: 'POST',
      body: JSON.stringify(newBlock),
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