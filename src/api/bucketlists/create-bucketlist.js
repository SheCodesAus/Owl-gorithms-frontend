async function createBucketList(data, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
        const fallbackError = "Error creating a bucket list";
        const errorMessage = resData?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return resData;

}

export default createBucketList;