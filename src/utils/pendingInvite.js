const PENDING_INVITE_KEY = "pendingInviteToken";

export function savePendingInviteToken(token) {
    sessionStorage.setItem(PENDING_INVITE_KEY, token);
}

export function getPendingInviteToken() {
    return sessionStorage.getItem(PENDING_INVITE_KEY);
}

export function clearPendingInviteToken() {
    sessionStorage.removeItem(PENDING_INVITE_KEY);
}