import { useAuth } from "./use-auth";
import {
    generateInvite,
    getInvite,
    regenerateInvite,
    previewInvite,
    acceptInvite,
} from "../api/invites";

export function useInvites() {
    const { auth } = useAuth();
    const token = auth?.access;

    const createInvite = async (bucketListId, role) => {
        if (!token) throw new Error("User not logged in");

        return generateInvite(bucketListId, role, token);
    };

    const loadInvite = async (bucketListId, role) => {
        if (!token) throw new Error("User not logged in");

        return getInvite(bucketListId, role, token);
    };

    const refreshInvite = async (bucketListId, role) => {
        if (!token) throw new Error("User not logged in");

        return regenerateInvite(bucketListId, role, token);
    };

    const loadInvitePreview = async (inviteToken) => {
        if (!token) throw new Error("User not logged in");

        return previewInvite(inviteToken, token);
    };

    const confirmInvite = async (inviteToken) => {
        if (!token) throw new Error("User not logged in");

        return acceptInvite(inviteToken, token);
    };

    return {
        createInvite,
        loadInvite,
        refreshInvite,
        loadInvitePreview,
        confirmInvite,
    };
}