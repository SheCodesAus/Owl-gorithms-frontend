async function acceptInvite(inviteToken, token) {
    const url = `${import.meta.env.VITE_API_URL}/invites/${inviteToken}/accept/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept: true }),
    });

    if (!response.ok) {
        const fallbackError = "Failed to accept invite";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default acceptInvite;