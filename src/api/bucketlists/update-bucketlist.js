async function updateBucketList(bucketListId, data, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
        const fallBackError = "Failed to update bucket list";
        const errorMessage = resData?.detail ?? fallBackError;

        const error = new Error(errorMessage);
        error.responseData = resData;
        throw error;
    }

    return resData;

}

export default updateBucketList;