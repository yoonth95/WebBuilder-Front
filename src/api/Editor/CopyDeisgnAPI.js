export const CopyDeisgnAPI = async (sourcePage, targetPage) => {
  try {
    console.log(sourcePage, targetPage);
    const res = await fetch('/api/copyDesign', {
      method: 'POST',
      body: JSON.stringify({"sourcePage": sourcePage, "targetPage": targetPage}),
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