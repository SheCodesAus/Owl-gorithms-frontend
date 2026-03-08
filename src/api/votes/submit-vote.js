async function submitVote(itemId, voteType, token) {
    const url = `${import.meta.env.VITE_API_URL}/items/${itemId}/vote/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ vote_type: voteType }),
    });

    if (!response.ok) {
        const fallBackError = "Failed to submit vote";

        const data = await response.json().catch(() => {
            throw new Error(fallBackError);
        });

        const errorMessage = data?.detail ?? fallBackError;
        throw new Error(errorMessage);
    }

    return await response.json();

    }

    export default submitVote;