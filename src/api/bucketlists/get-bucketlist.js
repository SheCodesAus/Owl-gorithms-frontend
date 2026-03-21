async function getBucketList(bucketListId, token = null) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/`;

    const headers = {};

    // Only send Authorization header if a token exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    });

    if (!response.ok) {
        const fallbackError = `Error fetching bucket list with id ${bucketListId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default getBucketList;