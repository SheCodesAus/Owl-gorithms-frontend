import { useEffect, useMemo, useState } from "react";
import FormModal from "../UI/FormModal";
import Avatar from "../UI/Avatar";

function ViewMembersModal({
  isOpen,
  onClose,
  bucketList,
  currentUser,
  onChangeRole,
  onRemoveMember,
  onLeaveList,
  isUpdatingMemberId = null,
}) {
  const [editingMembershipId, setEditingMembershipId] = useState(null);
  const [pendingRole, setPendingRole] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEditingMembershipId(null);
      setPendingRole("");
    }
  }, [isOpen]);

  const roleOrder = { owner: 0, editor: 1, viewer: 2 };

  const memberships = useMemo(() => {
    return [...(bucketList?.memberships ?? [])].sort((a, b) => {
      return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
    });
  }, [bucketList?.memberships]);

  const isOwner = bucketList?.owner?.id === currentUser?.id;

  const startEditingRole = (membership) => {
    setEditingMembershipId(membership.id);
    setPendingRole(membership.role);
  };

  const cancelEditingRole = () => {
    setEditingMembershipId(null);
    setPendingRole("");
  };

  const submitRoleUpdate = async (membershipId) => {
    if (!pendingRole) return;
    await onChangeRole?.(membershipId, pendingRole);
    setEditingMembershipId(null);
    setPendingRole("");
  };

  if (!isOpen || !bucketList) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Connected members"
      subtitle="See everyone connected to this bucket list."
    >
      <div className="space-y-4">

          <div className="space-y-3">
            {memberships.map((membership) => {
              const memberUser = membership.user;
              const isCurrentUser = memberUser?.id === currentUser?.id;
              const isMembershipOwner =
                memberUser?.id === bucketList.owner?.id ||
                membership.role === "owner";
              const isUpdating = isUpdatingMemberId === membership.id;
              const isEditing = editingMembershipId === membership.id;

              const canManageThisMember = isOwner && !isMembershipOwner;
              const canLeaveThisList = !isOwner && isCurrentUser;

              const displayName =
                memberUser?.display_name ||
                memberUser?.first_name ||
                memberUser?.username ||
                "Unknown user";

              return (
                <div
                  key={membership.id}
                  className="rounded-[1.75rem] border border-black/10 bg-white/60 p-4 shadow-[0_10px_30px_rgba(31,24,56,0.08)] backdrop-blur-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0">
                        <Avatar user={memberUser} size="lg" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm sm:text-base font-semibold text-[var(--heading-text)]">
                            {displayName}
                          </p>

                          {isCurrentUser ? (
                            <span className="rounded-full bg-black/6 px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-text)]">
                              You
                            </span>
                          ) : null}

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isMembershipOwner
                                ? "bg-amber-100 text-amber-700"
                                : membership.role === "editor"
                                  ? "bg-violet-100 text-violet-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {isMembershipOwner
                              ? "Owner"
                              : membership.role === "editor"
                                ? "Editor"
                                : "Viewer"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      {canManageThisMember && !isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditingRole(membership)}
                            disabled={isUpdating}
                            className="secondary-modal-button"
                          >
                            Change role
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemoveMember?.(membership)}
                            disabled={isUpdating}
                            className="rounded-2xl cursor-pointer border border-red-300 bg-red-50 px-3 py-2 sm:px-5 sm:py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </>
                      ) : null}

                      {canManageThisMember && isEditing ? (
                        <div className="flex w-full flex-col gap-3 rounded-[1.25rem] border border-black/8 bg-black/[0.03] p-3 sm:w-auto sm:min-w-[420px]">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                            Member role
                          </p>

                          <div className="flex gap-2">
                            {["viewer", "editor"].map((role) => (
                              <button
                                key={role}
                                type="button"
                                disabled={isUpdating}
                                onClick={() => setPendingRole(role)}
                                className={`flex-1 rounded-xl border py-2 text-sm font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                  pendingRole === role
                                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                    : "border-black/12 bg-white text-[var(--heading-text)] hover:bg-black/4"
                                }`}
                              >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </button>
                            ))}
                          </div>

                          <div className="form-actions">
                            <button
                              type="button"
                              onClick={cancelEditingRole}
                              className="secondary-modal-button"
                              disabled={isUpdating}
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() => submitRoleUpdate(membership.id)}
                              disabled={
                                isUpdating || !pendingRole || pendingRole === membership.role
                              }
                              className="primary-gradient-button rounded-2xl px-3 py-2 sm:px-5 sm:py-3 text-sm font-semibold"
                            >
                              {isUpdating ? "Updating..." : "Update"}
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {canLeaveThisList ? (
                        <button
                          type="button"
                          onClick={() => onLeaveList?.(membership)}
                          disabled={isUpdating}
                          className="danger-modal-button"
                        >
                          Leave list
                        </button>
                      ) : null}

                      {isMembershipOwner ? (
                        <span className="text-sm font-semibold text-[var(--muted-text)]">
                          Owner
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        {memberships.length === 1 ?
        <div className="rounded-[1.5rem] flex justify-center border border-black/10 bg-white/80 p-4 text-sm text-[var(--muted-text)] shadow-sm">
          Life is better done with friends. What are you waiting for?
        </div> : null }
      </div>
    </FormModal>
  );
}

export default ViewMembersModal;