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
import { useInvites } from "../../hooks/useInvites";

const ROLE_CONFIG = {
  editor: {
    title: "Editor access",
    description: "Can add items and manage the items they created.",
    icon: Pencil,
  },
  viewer: {
    title: "Viewer access",
    description: "Can view the list. Voting depends on the list settings.",
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
  onRegenerate,
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

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--surface-soft)]/95 p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      </div>

      <div className="relative z-[1]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--heading-text)] shadow-sm">
                <Icon size={18} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--heading-text)]">
                  {config.title}
                </h3>
                <p className="text-sm text-[var(--muted-text)]">
                  {config.description}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit rounded-full border border-[var(--card-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--heading-text)] shadow-sm">
            {statusLabel}
          </div>
        </div>

        <div className="mt-5">
          <div className="form-field">
            <label
              htmlFor={`${role}-invite-link`}
              className="form-label"
            >
              Share link
            </label>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <LinkIcon
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                />

                <input
                  id={`${role}-invite-link`}
                  type="text"
                  readOnly
                  value={invite?.invite_url ?? ""}
                  placeholder={isLoading ? "Loading..." : "No link generated yet"}
                  className="form-input pl-10"
                />
              </div>

              {invite ? (
                <button
                  type="button"
                  onClick={() => onCopy(role, invite.invite_url)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 font-semibold text-[var(--heading-text)] shadow-sm transition hover:-translate-y-[1px] disabled:opacity-60"
                  disabled={isBusy}
                >
                  <Copy size={16} />
                  {copiedRole === role ? "Copied!" : "Copy link"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(role)}
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary-cta)] px-4 py-3 font-semibold text-[var(--cta-text)] transition hover:bg-[var(--primary-cta-hover)] disabled:opacity-60"
                  disabled={isBusy || isLoading}
                >
                  {isBusy ? "Generating..." : "Generate link"}
                </button>
              )}
            </div>
          </div>
        </div>

        {invite ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[var(--card-border)] bg-white/80 px-4 py-3">
              <p className="text-sm font-medium text-[var(--heading-text)]">
                {formatExpiryText(invite.expires_at)}
              </p>
              {formatExactExpiry(invite.expires_at) ? (
                <p className="mt-1 text-xs text-[var(--muted-text)]">
                  Exact expiry: {formatExactExpiry(invite.expires_at)}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-900">
                Generating a new link will replace the current one. Anyone using
                the old link will no longer be able to join with it.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onRegenerate(role)}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 font-semibold text-[var(--heading-text)] shadow-sm transition hover:-translate-y-[1px] disabled:opacity-60"
                disabled={isBusy}
              >
                <RefreshCw
                  size={16}
                  className={isBusy ? "animate-spin" : ""}
                />
                {isBusy ? "Regenerating..." : "Regenerate link"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--card-border)] bg-white/70 px-4 py-3">
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

  const [editorInvite, setEditorInvite] = useState(null);
  const [viewerInvite, setViewerInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [copiedRole, setCopiedRole] = useState("");
  const [error, setError] = useState("");

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
        } else {
          const message = editorResult.reason?.message?.toLowerCase?.() || "";
          if (message.includes("no invite exists")) {
            setEditorInvite(null);
          } else {
            throw editorResult.reason;
          }
        }

        if (viewerResult.status === "fulfilled") {
          setViewerInvite(viewerResult.value);
        } else {
          const message = viewerResult.reason?.message?.toLowerCase?.() || "";
          if (message.includes("no invite exists")) {
            setViewerInvite(null);
          } else {
            throw viewerResult.reason;
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Unable to load invite links.");
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
  }, [isOpen, bucketListId, loadInvite]);

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
    } catch (err) {
      setError(err.message || `Unable to generate ${role} invite.`);
    } finally {
      setActionLoading("");
    }
  }

  async function handleRegenerate(role) {
    const confirmed = window.confirm(
      "Generate a new link? The current link will stop working immediately."
    );

    if (!confirmed) return;

    try {
      setActionLoading(role);
      setError("");

      const invite = await refreshInvite(bucketListId, role);

      if (role === "editor") {
        setEditorInvite(invite);
      } else {
        setViewerInvite(invite);
      }
    } catch (err) {
      setError(err.message || `Unable to regenerate ${role} invite.`);
    } finally {
      setActionLoading("");
    }
  }

  async function handleCopy(role, link) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedRole(role);

      window.setTimeout(() => {
        setCopiedRole((current) => (current === role ? "" : current));
      }, 1800);
    } catch {
      setError("Could not copy the link to your clipboard.");
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite members"
      subtitle="Create and share access links for this bucket list. Each role has its own link, and only the latest active link for that role will work."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--card-border)] bg-gradient-to-br from-white via-[var(--surface-soft)] to-white px-5 py-5 shadow-sm">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-[var(--accent)]/10 blur-2xl" />
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[var(--primary-cta)]/10 blur-2xl" />
          </div>

          <div className="relative z-[1] flex items-start gap-4">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--heading-text)] shadow-sm">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--heading-text)]">
                Share access with confidence
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                Use editor links for collaborators who will actively contribute,
                and viewer links for people who just need to see the list. If you
                regenerate a link, the old one stops working immediately.
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <InviteRoleCard
          role="editor"
          invite={editorInvite}
          isLoading={isLoading}
          actionLoading={actionLoading}
          copiedRole={copiedRole}
          onGenerate={handleGenerate}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
        />

        <InviteRoleCard
          role="viewer"
          invite={viewerInvite}
          isLoading={isLoading}
          actionLoading={actionLoading}
          copiedRole={copiedRole}
          onGenerate={handleGenerate}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
        />
      </div>
    </FormModal>
  );
}

export default InviteMembersModal;