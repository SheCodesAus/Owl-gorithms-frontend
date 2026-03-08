async function createItem(bucketListId, data, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/items/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const fallBackError = `Failed to create item for bucket list with id ${bucketListId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default createItem;