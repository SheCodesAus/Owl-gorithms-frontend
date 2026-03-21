async function deleteMembership(bucketListId, membershipId, token) {
  const url = `${import.meta.env.VITE_API_URL}/bucketlists/${bucketListId}/members/${membershipId}/`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const fallBackError = "Failed to remove member";

    const data = await response.json().catch(() => {
      throw new Error(fallBackError);
    });

    const errorMessage = data?.detail ?? fallBackError;
    throw new Error(errorMessage);
  }

  return true;
}

export default deleteMembership;