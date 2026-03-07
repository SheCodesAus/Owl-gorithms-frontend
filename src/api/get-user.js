async function getUser(token) {
    const url = `${import.meta.env.VITE_API_URL}/parents/me/`;

    const response = await fetch(url, {
        method: "GET",
        headers: token
            ? {"Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"}
            : {},
        });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const fallbackError = `Error fetching current account.`;
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return data;
}

export default getUser;