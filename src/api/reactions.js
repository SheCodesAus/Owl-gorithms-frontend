export async function reactToItem(itemId, reactionType, token) {
    const url = `${import.meta.env.VITE_API_URL}/items/${itemId}/react/`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reaction_type: reactionType }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to react to item.");
  }

  return response.json();
}