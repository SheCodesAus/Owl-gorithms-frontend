import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInvite();

    return () => {
      isMounted = false;
    };
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

  const handleDecline = () => {
    setDeclined(true);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading invitation...</p>
        </div>
      </section>
    );
  }

  if (error && !invite) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold mb-3">Invite unavailable</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl px-5 py-3 font-semibold bg-slate-900 text-white"
          >
            Return home
          </button>
        </div>
      </section>
    );
  }

  const isExpired = invite?.is_expired || !invite?.is_valid || !invite?.is_active;

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-pink-100" />

      <div
        className={`relative z-10 min-h-screen transition-all duration-300 ${
          declined ? "blur-0" : "blur-sm"
        }`}
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              Bucket List Preview
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {invite.bucket_list_title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              {invite.bucket_list_description || "No description yet."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur"
              >
                <div className="mb-4 h-4 w-24 rounded-full bg-slate-200" />
                <div className="mb-3 h-6 w-3/4 rounded-full bg-slate-300" />
                <div className="mb-2 h-4 w-full rounded-full bg-slate-200" />
                <div className="mb-6 h-4 w-5/6 rounded-full bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-9 w-20 rounded-full bg-violet-100" />
                  <div className="h-9 w-20 rounded-full bg-pink-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!declined && (
        <div className="absolute inset-0 z-20 bg-slate-950/35" />
      )}

      <AnimatePresence>
        {!declined && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-8 shadow-2xl"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                Invitation
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Join {invite.bucket_list_title}?
              </h2>

              <p className="mt-4 text-slate-600">
                You’ve been invited to join this bucket list as an{" "}
                <span className="font-semibold capitalize">{invite.role}</span>.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Shared by {invite.owner_email}
              </p>

              {invite.already_member && (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  You’re already a member of this bucket list.
                </div>
              )}

              {isExpired && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  This invite is no longer valid.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="rounded-2xl cursor-pointer border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={isAccepting}
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting || invite.already_member || isExpired}
                  className="rounded-2xl cursor-pointer bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAccepting ? "Joining..." : "Accept invitation"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {declined && (
        <div className="absolute inset-x-0 top-8 z-30 flex justify-center px-6">
          <div className="rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
            <p className="font-medium text-slate-700">
              Invitation declined. You can close this page.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default InviteAcceptPage;