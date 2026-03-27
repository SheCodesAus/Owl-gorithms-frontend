import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useBucketList } from "../hooks/useBucketList";
import { useVotes } from "../hooks/useVotes";
import { useAuth } from "../hooks/use-auth";
import { updateItem, deleteItem } from "../api/items";

import ItemDetailCard from "../components/items/ItemDetailCard";
import ExtendedItemCard from "../components/items/ExtendedItemCard";
import StatusUpdateModal from "../components/modals/StatusUpdateModal";
import ItemDateModal from "../components/modals/ItemDateModal";
import EditItemModal from "../components/modals/EditItemModal";
import DeleteItemModal from "../components/modals/DeleteItemModal";
import CalendarExportModal from "../components/modals/CalendarExportModal";

function getNextVoteState(currentVote, currentScore, clickedVote) {
  const nextVote = currentVote === clickedVote ? null : clickedVote;
  let nextScore = currentScore;

  if (currentVote === "upvote") nextScore -= 1;
  if (currentVote === "downvote") nextScore += 1;
  if (nextVote === "upvote") nextScore += 1;
  if (nextVote === "downvote") nextScore -= 1;

  return { nextVote, nextScore };
}

export default function BucketListItemPage() {
  const { listId, itemId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { bucketList, loadBucketList } = useBucketList(Number(listId));
  const { voteOnItem, clearVote } = useVotes();
  const currentUser = auth?.user;

  const [item, setItem] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [dateErrors, setDateErrors] = useState({});
  const [voteOverride, setVoteOverride] = useState(null);

  useEffect(() => {
    if (bucketList?.items) {
      const found = bucketList.items.find((it) => it.id === Number(itemId));
      setItem(found || null);
      setVoteOverride(null);
    }
  }, [bucketList, itemId]);

  const currentUserMembership = useMemo(() => {
    if (!currentUser?.id || !bucketList?.memberships) return null;
    return (
      bucketList.memberships.find(
        (m) => Number(m.user?.id) === Number(currentUser.id),
      ) ?? null
    );
  }, [bucketList, currentUser]);

  const isOwner =
    bucketList?.owner?.id && currentUser?.id
      ? Number(bucketList.owner.id) === Number(currentUser.id)
      : false;

  const memberRole = currentUserMembership?.role ?? null;

  const isCreator =
  item?.created_by?.id && currentUser?.id
    ? Number(item.created_by.id) === Number(currentUser.id)
    : item?.creator?.id && currentUser?.id
      ? Number(item.creator.id) === Number(currentUser.id)
      : false;

const canEdit =
  isOwner ||
  (!bucketList?.is_frozen && memberRole === "editor" && isCreator);

const canManageDates = isOwner || isCreator;

  const canVote = useMemo(() => {
    if (!currentUser) return false;
    if (bucketList?.is_frozen) return false;
    if (isOwner || memberRole === "editor") return true;
    if (memberRole === "viewer")
      return bucketList?.allow_viewer_voting ?? false;
    return false;
  }, [currentUser, bucketList, isOwner, memberRole]);

  const baseVoteScore =
    item?.vote_score ?? item?.votes_count ?? item?.score ?? 0;

  const baseUserVote =
    item?.user_vote ?? item?.current_user_vote ?? item?.vote_type ?? null;

  const effectiveVoteScore = voteOverride?.voteScore ?? baseVoteScore;
  const effectiveUserVote = voteOverride?.userVote ?? baseUserVote;

  const handleVote = async (clickedVote) => {
    if (!item || !canVote || item.status === "complete") return;

    const previousState = {
      voteScore: effectiveVoteScore,
      userVote: effectiveUserVote,
    };

    const { nextVote, nextScore } = getNextVoteState(
      previousState.userVote,
      previousState.voteScore,
      clickedVote,
    );

    setVoteOverride({
      voteScore: nextScore,
      userVote: nextVote,
    });
    setIsVoting(true);

    try {
      if (nextVote === null) {
        await clearVote(item.id);
      } else {
        await voteOnItem(item.id, nextVote);
      }
      await loadBucketList();
    } catch (error) {
      setVoteOverride(previousState);
      console.error(error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleStatusUpdate = async (val) => {
    if (!item) return;
    const newStatus = typeof val === "string" ? val : val?.status;
    if (!newStatus) return;
    setIsSavingStatus(true);
    setStatusError("");
    try {
      await updateItem(item.id, { status: newStatus }, auth?.access);
      await loadBucketList();
      setShowStatusModal(false);
    } catch (error) {
      setStatusError(error.message);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleSaveDate = async (dateData) => {
    if (!item) return;
    setIsSavingDate(true);
    setDateErrors({});
    try {
      const shouldAutoLock =
        isOwner &&
        item?.status === "proposed" &&
        !!(dateData?.start_date ?? item?.start_date);

      const payload = shouldAutoLock
        ? { ...dateData, status: "locked_in" }
        : dateData;

      await updateItem(item.id, payload, auth?.access);
      await loadBucketList();
      setShowDateModal(false);
    } catch (error) {
      setDateErrors({ non_field_errors: error.message });
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleSave = async (formData) => {
    if (!item) return;
    setIsSaving(true);
    try {
      await updateItem(item.id, formData, auth?.access);
      await loadBucketList();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteItem(item.id, auth?.access);
      navigate(`/bucketlists/${listId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!bucketList) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(122,84,199,0.18),_transparent_24%),linear-gradient(180deg,#2a0d54_0%,#1b083a_58%,#15072f_100%)] px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[#ff8f8f]/20 blur-3xl" />
          <div className="absolute right-[-5rem] top-[10%] h-80 w-80 rounded-full bg-[#8c61ff]/20 blur-3xl" />
          <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-[#ffb085]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 px-8 py-10 text-center shadow-[0_30px_80px_rgba(7,4,19,0.32)] backdrop-blur-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
            <p className="mt-4 text-base font-medium text-white/80">
              Loading item details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(122,84,199,0.18),_transparent_24%),linear-gradient(180deg,#2a0d54_0%,#1b083a_58%,#15072f_100%)] px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[#ff8f8f]/20 blur-3xl" />
          <div className="absolute right-[-5rem] top-[10%] h-80 w-80 rounded-full bg-[#8c61ff]/20 blur-3xl" />
          <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-[#ffb085]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 px-6 py-10 shadow-[0_30px_80px_rgba(7,4,19,0.32)] backdrop-blur-xl sm:px-10">
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">
              Item not found
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#fff8fb] sm:text-5xl">
              This item has wandered off.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
              The item you were looking for couldn’t be found in this bucket
              list. Head back and keep the momentum going.
            </p>

            <button
              type="button"
              onClick={() => navigate(`/bucketlists/${listId}`)}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff8c78] via-[#ff6f86] to-[#8c61ff] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(73,32,136,0.34)] transition hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} />
              Back to list
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(122,84,199,0.18),_transparent_24%),linear-gradient(180deg,#2a0d54_0%,#1b083a_58%,#15072f_100%)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[#ff8f8f]/20 blur-3xl" />
          <div className="absolute right-[-5rem] top-[10%] h-80 w-80 rounded-full bg-[#8c61ff]/20 blur-3xl" />
          <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-[#ffb085]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl xl:max-w-7xl">
          <motion.div
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] shadow-[0_30px_80px_rgba(7,4,19,0.32)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="border-b border-white/8 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.06),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-5 py-5 sm:px-8 sm:py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-white/55">
                    Item
                  </p>

                  <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight tracking-[-0.02em] text-[#fff8fb] sm:text-4xl sm:leading-[0.95] sm:tracking-[-0.05em] md:text-5xl lg:text-6xl">
                    {item.title}
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 sm:text-base">
                    Deep dive into the details, update progress, and keep this
                    plan moving.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/88 backdrop-blur-md">
                      {bucketList.title}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/88 backdrop-blur-md">
                      <Sparkles size={14} />
                      {bucketList.is_frozen ? "Frozen list" : "Active list"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/bucketlists/${listId}`)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/14"
                >
                  <ArrowLeft size={16} />
                  Back to list
                </button>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-start">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.35 }}
                >
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-3 shadow-[0_20px_50px_rgba(12,6,30,0.22)] backdrop-blur-md sm:p-2">
                    <ItemDetailCard
                      bucketList={bucketList}
                      item={item}
                      canEdit={canEdit}
                      canManageDates={canManageDates}
                      isOwner={isOwner}
                      canVote={canVote}
                      voteScore={effectiveVoteScore}
                      userVote={effectiveUserVote}
                      isVoting={isVoting}
                      onBack={() => navigate(`/bucketlists/${listId}`)}
                      onUpvote={() => handleVote("upvote")}
                      onDownvote={() => handleVote("downvote")}
                      onAddToCalendar={() => setShowCalendarModal(true)}
                      onAddDate={() => setShowDateModal(true)}
                      onEdit={() => setShowEditModal(true)}
                      onDelete={() => setShowDeleteModal(true)}
                      onUpdateStatus={(val) => {
                        if (typeof val === "string") handleStatusUpdate(val);
                        else setShowStatusModal(true);
                      }}
                      showBreadcrumb={false}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.35 }}
                >
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-3 shadow-[0_20px_50px_rgba(12,6,30,0.22)] backdrop-blur-md sm:p-2">
                    <ExtendedItemCard itemTitle={item.title} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <CalendarExportModal
        item={item}
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      <StatusUpdateModal
        item={item}
        isOpen={showStatusModal}
        onSave={handleStatusUpdate}
        onClose={() => setShowStatusModal(false)}
        isSaving={isSavingStatus}
        error={statusError}
      />

      <ItemDateModal
        item={item}
        isOpen={showDateModal}
        onSave={handleSaveDate}
        onClose={() => {
          setShowDateModal(false);
          setDateErrors({});
        }}
        isSaving={isSavingDate}
        errors={dateErrors}
      />

      <EditItemModal
        item={item}
        isOpen={showEditModal}
        onSave={handleSave}
        onClose={() => setShowEditModal(false)}
        isSaving={isSaving}
      />

      <DeleteItemModal
        item={item}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}