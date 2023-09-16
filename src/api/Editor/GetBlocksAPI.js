export const fetchData = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(`Fetch failed: ${response.status}, ${data}`);
    }

    return await response.json();
};


export const GetBlocksAPI = async (user_idx, idx) => {
    try {
        const res = await fetch(`/api/getUserId/${user_idx}`, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data);
        const userID = data[0].userID;

        const menu = await fetchData(`/api/getMenu/${userID}/${idx}`);
        if (menu.length === 0) {
            return null; // 메뉴가 없는 경우
        }
        const blocks = menu[0].save_time === null ? await fetchData(`/api/getBlocks/${idx}`) : await fetchData(`/api/getBlocksBackup/${idx}/${menu[0].save_time}`);

        return blocks; // 블록이 없는 경우 빈 배열이 반환됨
    } catch (err) {
        console.error(err);
        throw err;
    }
};