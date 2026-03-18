async function updateMembershipRole(bucketListId, membershipId, data, token) {
  const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/members/${membershipId}/`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const fallBackError = "Failed to update member role";

    const data = await response.json().catch(() => {
      throw new Error(fallBackError);
    });

    const errorMessage = data?.detail ?? fallBackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default updateMembershipRole;