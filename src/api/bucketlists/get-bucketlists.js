async function getBucketLists(token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const fallBackError = "Error fetching bucket lists";

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }
    return await response.json();
}

export default getBucketLists;