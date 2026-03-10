async function getInvite(bucketListId, role, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/invites/${role}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = `Error fetching ${role} invite for bucket list with id ${bucketListId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();

}

export default getInvite;