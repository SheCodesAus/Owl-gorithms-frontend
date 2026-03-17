async function removeVote(itemId, token) {
    const url = `${import.meta.env.VITE_API_URL}/items/${itemId}/vote/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const fallBackError = "Failed to remove vote";

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }

    return true;

    }

    export default removeVote;