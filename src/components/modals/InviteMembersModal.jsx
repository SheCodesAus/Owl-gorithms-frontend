import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  RefreshCw,
  Link as LinkIcon,
  Pencil,
  Eye,
  Sparkles,
} from "lucide-react";
import FormModal from "../UI/FormModal";
import ConfirmActionModal from "../modals/ConfirmActionModal";
import { useInvites } from "../../hooks/useInvites";
import { useBanner } from "../UI/BannerProvider";

const ROLE_CONFIG = {
  editor: {
    title: "Editor access",
    description: "Can add items, vote, and manage the items they created.",
    icon: Pencil,
  },
  viewer: {
    title: "Viewer access",
    description: "Can view the list. Voting can be enabled for viewers in Settings.",
    icon: Eye,
  },
};

function formatExpiryText(expiresAt) {
  if (!expiresAt) return "No expiry available";

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (Number.isNaN(expiry.getTime())) return "No expiry available";
  if (diffMs <= 0) return "Expired";

  const totalMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (totalDays >= 1) {
    return `Expires in ${totalDays} day${totalDays === 1 ? "" : "s"}`;
  }

  if (totalHours >= 1) {
    return `Expires in ${totalHours} hour${totalHours === 1 ? "" : "s"}`;
  }

  return `Expires in ${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
}

function formatExactExpiry(expiresAt) {
  if (!expiresAt) return "";

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return "";

  return expiry.toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInviteStatus(invite) {
  if (!invite) return "not_created";
  if (!invite.is_active) return "inactive";
  if (invite.is_expired || !invite.is_valid) return "expired";
  return "active";
}

function InviteRoleCard({
  role,
  invite,
  isLoading,
  actionLoading,
  copiedRole,
  onGenerate,
  onCopy,
  onRequestRegenerate,
}) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;
  const status = getInviteStatus(invite);
  const isBusy = actionLoading === role;

  const statusLabel = useMemo(() => {
    if (status === "active") return "Active";
    if (status === "expired") return "Expired";
    if (status === "inactive") return "Inactive";
    return "Not generated";
  }, [status]);

  const statusClassName = useMemo(() => {
    if (status === "active") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "expired") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    if (status === "inactive") {
      return "border-slate-200 bg-slate-100 text-slate-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-700";
  }, [status]);

  return (
    <section className="rounded-[1.6rem] border border-black/10 bg-white/90 p-4 shadow-[0_12px_30px_rgba(31,24,56,0.08)] sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-white text-[var(--heading-text)] shadow-sm">
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">
                    {config.title}
                  </h3>

                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClassName}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                  {config.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-black/8 bg-[var(--surface-soft)]/70 p-3 sm:p-4">
          <label
            htmlFor={`${role}-invite-link`}
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]"
          >
            Share
          </label>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <LinkIcon
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
              />

              <input
                id={`${role}-invite-link`}
                type="text"
                readOnly
                value={invite?.invite_url ?? ""}
                placeholder={isLoading ? "Loading..." : "No link generated yet"}
                className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm font-medium text-[var(--heading-text)] outline-none placeholder:text-[var(--muted-text)]"
              />
            </div>

            {invite ? (
              <button
                type="button"
                onClick={() => onCopy(role, invite.invite_url)}
                className="secondary-modal-button"
                disabled={isBusy}
              >
                <span className="inline-flex items-center gap-2">
                  <Copy size={16} />
                  {copiedRole === role ? "Copied!" : "Copy"}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onGenerate(role)}
                className="primary-gradient-button"
                disabled={isBusy || isLoading}
              >
                {isBusy ? "Generating..." : "Generate link"}
              </button>
            )}
          </div>
        </div>

        {invite ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-[var(--heading-text)]">
                  {formatExpiryText(invite.expires_at)}
                </p>
                {formatExactExpiry(invite.expires_at) ? (
                  <p className="mt-1 text-xs text-[var(--muted-text)]">
                    Exact expiry: {formatExactExpiry(invite.expires_at)}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800 sm:text-sm">
                  Regenerating will immediately replace the current link.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRequestRegenerate(role)}
              className="secondary-modal-button"
              disabled={isBusy}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={16} className={isBusy ? "animate-spin" : ""} />
                {isBusy ? "Regenerating..." : "Regenerate"}
              </span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-[var(--surface-soft)]/55 px-4 py-3">
            <p className="text-sm text-[var(--muted-text)]">
              No link has been generated for this role yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function InviteMembersModal({ isOpen, onClose, bucketListId }) {
  const { loadInvite, createInvite, refreshInvite } = useInvites();
  const { showBanner } = useBanner();

  const [editorInvite, setEditorInvite] = useState(null);
  const [viewerInvite, setViewerInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [copiedRole, setCopiedRole] = useState("");
  const [error, setError] = useState("");
  const [confirmRole, setConfirmRole] = useState("");

  useEffect(() => {
    if (!isOpen || !bucketListId) return;

    let isMounted = true;

    async function fetchInvites() {
      setIsLoading(true);
      setError("");

      try {
        const [editorResult, viewerResult] = await Promise.allSettled([
          loadInvite(bucketListId, "editor"),
          loadInvite(bucketListId, "viewer"),
        ]);

        if (!isMounted) return;

        if (editorResult.status === "fulfilled") {
          setEditorInvite(editorResult.value);
        } else if (editorResult.reason?.status === 404) {
          setEditorInvite(null);
        } else {
          throw editorResult.reason;
        }

        if (viewerResult.status === "fulfilled") {
          setViewerInvite(viewerResult.value);
        } else if (viewerResult.reason?.status === 404) {
          setViewerInvite(null);
        } else {
          throw viewerResult.reason;
        }
      } catch (err) {
        if (!isMounted) return;

        const message = err.message || "Unable to load invite links.";
        setError(message);

        showBanner({
          type: "error",
          message,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInvites();

    return () => {
      isMounted = false;
    };
  }, [isOpen, bucketListId, loadInvite, showBanner]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmRole("");
    }
  }, [isOpen]);

  async function handleGenerate(role) {
    try {
      setActionLoading(role);
      setError("");

      const invite = await createInvite(bucketListId, role);

      if (role === "editor") {
        setEditorInvite(invite);
      } else {
        setViewerInvite(invite);
      }

      showBanner({
        type: "success",
        message: `${role === "editor" ? "Editor" : "Viewer"} invite link generated.`,
      });
    } catch (err) {
      const message = err.message || `Unable to generate ${role} invite.`;
      setError(message);

      showBanner({
        type: "error",
        message,
      });
    } finally {
      setActionLoading("");
    }
  }

  function handleRequestRegenerate(role) {
    setConfirmRole(role);
  }

  async function handleConfirmRegenerate() {
    if (!confirmRole) return;

    const role = confirmRole;

    try {
      setActionLoading(role);
      setError("");

      const invite = await refreshInvite(bucketListId, role);

      if (role === "editor") {
        setEditorInvite(invite);
      } else {
        setViewerInvite(invite);
      }

      setConfirmRole("");

      showBanner({
        type: "success",
        message: `${role === "editor" ? "Editor" : "Viewer"} invite link regenerated. The previous link no longer works.`,
      });
    } catch (err) {
      const message = err.message || `Unable to regenerate ${role} invite.`;
      setError(message);

      showBanner({
        type: "error",
        message,
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleCopy(role, link) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedRole(role);

      showBanner({
        type: "success",
        message: `${role === "editor" ? "Editor" : "Viewer"} invite link copied.`,
      });

      window.setTimeout(() => {
        setCopiedRole((current) => (current === role ? "" : current));
      }, 1800);
    } catch {
      const message = "Could not copy the link to your clipboard.";
      setError(message);

      showBanner({
        type: "error",
        message,
      });
    }
  }

  const confirmRoleLabel = confirmRole === "editor" ? "Editor" : "Viewer";

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Invite members"
        subtitle="Generate share links for collaborators and viewers."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5">
          <div className="rounded-[1.6rem] border border-black/10 bg-white/88 p-5 shadow-[0_12px_30px_rgba(31,24,56,0.08)]">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-white text-[var(--heading-text)] shadow-sm">
                <Sparkles size={18} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[var(--heading-text)] sm:text-lg">
                  Share access with confidence
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                  Create separate links for editors and viewers. If you regenerate a link,
                  the previous link stops working immediately.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4">
            <InviteRoleCard
              role="editor"
              invite={editorInvite}
              isLoading={isLoading}
              actionLoading={actionLoading}
              copiedRole={copiedRole}
              onGenerate={handleGenerate}
              onCopy={handleCopy}
              onRequestRegenerate={handleRequestRegenerate}
            />

            <InviteRoleCard
              role="viewer"
              invite={viewerInvite}
              isLoading={isLoading}
              actionLoading={actionLoading}
              copiedRole={copiedRole}
              onGenerate={handleGenerate}
              onCopy={handleCopy}
              onRequestRegenerate={handleRequestRegenerate}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmActionModal
        isOpen={!!confirmRole}
        onClose={() => setConfirmRole("")}
        onConfirm={handleConfirmRegenerate}
        title={`Regenerate ${confirmRoleLabel} link?`}
        description={`This will immediately replace the current ${confirmRoleLabel.toLowerCase()} invite link. Anyone using the old link will no longer be able to join with it.`}
        confirmLabel="Regenerate link"
        tone="danger"
        isLoading={!!actionLoading}
      />
    </>
  );
}

export default InviteMembersModal;