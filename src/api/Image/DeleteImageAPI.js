export const DeleteImageAPI = async (imagePath) => {
  try {
    const res = await fetch('/api/deleteImage', {
      method: 'POST',
      body: JSON.stringify({ imageUrl: imagePath }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};