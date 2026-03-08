async function previewInvite(inviteToken, token) {
    const url = `${import.meta.env.VITE_API_URL}/invites/${inviteToken}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error fetching invite";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();

}

export default previewInvite;