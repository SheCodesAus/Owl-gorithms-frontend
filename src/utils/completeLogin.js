import acceptInvite from "../api/invites/accept-invite";
import {
    getPendingInviteToken,
    clearPendingInviteToken,
} from "./pendingInvite";

export async function completeLogin({
    access,
    refresh = null,
    setAuth,
    navigate,
}) {
    const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    });

    if (!userResponse.ok) {
        throw new Error("Failed to fetch user.");
    }

    const userData = await userResponse.json();

    setAuth({
        access,
        refresh,
        user: userData,
    });

    const pendingInviteToken = getPendingInviteToken();

    if (pendingInviteToken) {
        try {
            const inviteResponse = await acceptInvite(pendingInviteToken, access);
            clearPendingInviteToken();
            navigate(`/bucketlists/${inviteResponse.bucket_list_id}`);
            return;
        } catch (error) {
            clearPendingInviteToken();
            navigate(`/invites/${pendingInviteToken}`);
            return;
        }
    }

    navigate("/dashboard");
}