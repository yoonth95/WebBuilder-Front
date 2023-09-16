export const UpdateBlockLayoutAPI = async (block_id, layout_design) => {
  try {
    const res = await fetch('/api/updateBlockLayout', {
      method: 'PUT',
      body: JSON.stringify({block_id, layout_design}),
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