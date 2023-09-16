export const ChangeMenuSaveTimeAPI = async (page_idx, save_time) => {
  try {
    const res = await fetch('/api/changeMenuSaveTimeAPI', {
      method: 'POST',
      body: JSON.stringify({page_idx, save_time}),
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