import { useCallback } from "react";
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

  const createInvite = useCallback(
    async (bucketListId, role) => {
      if (!token) throw new Error("User not logged in");
      return generateInvite(bucketListId, role, token);
    },
    [token],
  );

  const loadInvite = useCallback(
    async (bucketListId, role) => {
      if (!token) throw new Error("User not logged in");
      return getInvite(bucketListId, role, token);
    },
    [token],
  );

  const refreshInvite = useCallback(
    async (bucketListId, role) => {
      if (!token) throw new Error("User not logged in");
      return regenerateInvite(bucketListId, role, token);
    },
    [token],
  );

  const loadInvitePreview = useCallback(
    async (inviteToken) => {
      return previewInvite(inviteToken, token);
    },
    [token],
  );

  const confirmInvite = useCallback(
    async (inviteToken) => {
      if (!token) throw new Error("User not logged in");
      return acceptInvite(inviteToken, token);
    },
    [token],
  );

  return {
    createInvite,
    loadInvite,
    refreshInvite,
    loadInvitePreview,
    confirmInvite,
  };
}