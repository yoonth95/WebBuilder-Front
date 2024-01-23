export const UpdateMenuAPI = async (formData) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/updateMenu`, {
      method: 'PUT',
      body: JSON.stringify(formData),
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
