async function toggleFreezeList(bucketListId, isFrozen, token) {
    const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/freeze/`;
 
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_frozen: isFrozen }),
    });
 
    if (!response.ok) {
        const fallback = `Failed to ${isFrozen ? "freeze" : "unfreeze"} bucket list.`;
        const data = await response.json().catch(() => { throw new Error(fallback); });
        throw new Error(data?.detail ?? fallback);
    }
 
    return await response.json();
}

export default toggleFreezeList;