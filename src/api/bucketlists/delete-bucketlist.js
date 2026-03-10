async function deleteBucketList(bucketListId, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const fallBackError = "Failed to delete bucket list";

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }

    return true;

}

export default deleteBucketList;