import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Globe, CheckCircle2, XCircle } from "lucide-react";
import { useInvites } from "../hooks/useInvites";
import { useAuth } from "../hooks/use-auth";
import { savePendingInviteToken } from "../utils/pendingInvite";

function InviteAcceptPage() {
  const { token: inviteToken } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { loadInvitePreview, confirmInvite } = useInvites();

  const [invite, setInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchInvite() {
      try {
        setIsLoading(true);
        setError("");
        const data = await loadInvitePreview(inviteToken);
        if (!isMounted) return;
        setInvite(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Unable to load invite.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchInvite();
    return () => { isMounted = false; };
  }, [inviteToken]);

  const handleAccept = async () => {
    if (!invite) return;

    if (!auth?.access) {
      savePendingInviteToken(inviteToken);
      navigate("/login");
      return;
    }

    try {
      setIsAccepting(true);
      setError("");
      const response = await confirmInvite(inviteToken);
      navigate(`/bucketlists/${response.bucket_list_id}`);
    } catch (err) {
      setError(err.message || "Failed to accept invite.");
      setIsAccepting(false);
    }
  };

  const handleDecline = () => setDeclined(true);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="section-card flex flex-col items-center gap-4 px-10 py-12 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d8d1ee] border-t-[#6b4eaa]" />
          <p className="text-lg font-semibold text-[var(--heading-text)]">
            Loading invitation...
          </p>
        </div>
      </div>
    );
  }

  // Error with no invite
  if (error && !invite) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="section-card max-w-md px-8 py-10 text-center">
          <XCircle className="mx-auto mb-4 text-[var(--accent)]" size={40} />
          <h1 className="brand-font text-2xl font-bold text-[var(--heading-text)]">
            Invite unavailable
          </h1>
          <p className="mt-2 text-[var(--muted-text)]">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="primary-gradient-button mt-6 rounded-full px-6 py-3 font-semibold"
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  const isExpired =
    invite?.is_expired || !invite?.is_valid || !invite?.is_active;

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12">
      {/* Background preview of the list — blurred */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-500 ${
          declined ? "" : "blur-sm"
        }`}
        aria-hidden="true"
      >
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)]">
            Bucket List Preview
          </p>
          <h2 className="brand-font mt-2 text-3xl font-bold text-[var(--heading-text)]">
            {invite?.bucket_list_title}
          </h2>
          <p className="mt-2 text-[var(--muted-text)]">
            {invite?.bucket_list_description || "No description yet."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="section-card p-5"
              >
                <div className="mb-3 h-4 w-20 rounded-full bg-[var(--surface)]" />
                <div className="mb-2 h-5 w-3/4 rounded-full bg-[var(--surface)]" />
                <div className="mb-2 h-3.5 w-full rounded-full bg-[var(--surface-soft)]" />
                <div className="h-3.5 w-5/6 rounded-full bg-[var(--surface-soft)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay scrim */}
      {!declined && (
        <div className="absolute inset-0 bg-[var(--heading-text)]/30 backdrop-blur-[2px]" />
      )}

      {/* Modal card */}
      <AnimatePresence>
        {!declined && (
          <motion.div
            className="relative z-10 w-full max-w-lg"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="modal-shell p-7 sm:p-8">
              {/* Eyebrow */}
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--primary-cta)]">
                Invitation
              </p>

              <h2 className="brand-font mt-3 text-3xl font-bold text-[var(--heading-text)]">
                Join {invite.bucket_list_title}?
              </h2>

              <p className="mt-4 text-[var(--body-text)]">
                You've been invited as a{" "}
                <span className="font-semibold capitalize text-[var(--primary-cta)]">
                  {invite.role}
                </span>
                .
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--muted-text)]">
                {invite.is_public ? (
                  <Globe size={13} aria-hidden="true" />
                ) : (
                  <Lock size={13} aria-hidden="true" />
                )}
                Shared by {invite.owner_email}
              </p>

              {/* Status alerts */}
              {invite.already_member && (
                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  <CheckCircle2 size={16} />
                  You're already a member of this bucket list.
                </div>
              )}

              {isExpired && (
                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <XCircle size={16} />
                  This invite is no longer valid.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="secondary-modal-button cursor-pointer"
                  disabled={isAccepting}
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting || invite.already_member || isExpired}
                  className="primary-gradient-button cursor-pointer rounded-full px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAccepting ? "Joining..." : "Accept invitation"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Declined state */}
      {declined && (
        <motion.div
          className="relative z-10 section-card px-6 py-5 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-medium text-[var(--heading-text)]">
            Invitation declined. You can close this page.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default InviteAcceptPage;