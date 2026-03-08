async function getItem(itemId, token) {
    const url = `${import.meta.env.VITE_API_URL}/items/${itemId}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const fallBackError = `Error fetching item with id ${itemId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }

    return await response.json();

}

export default getItem;