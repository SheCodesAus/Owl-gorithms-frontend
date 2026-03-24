import { AnimatePresence, motion } from "framer-motion";
import BucketListItemCard from "./BucketListItemCard";

export default function BucketListItemsPanel({
  items,
  selectedItemId,
  onSelectItem,
  onDoubleSelectItem,
  getItemVoteState,
  isVotingItemId,
  onVote,
  onReactionUpdate,
}) {
  return (
    <section className="bucketlist-items-panel">
      <div className="bucketlist-items-panel-scroll">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              className="empty-state-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="brand-font text-lg font-semibold text-[var(--heading-text)]">
                Nothing here yet.
              </p>
              <p className="mt-1 text-sm text-[var(--muted-text)]">
                Make a plan, do something new!
              </p>
            </motion.div>
          ) : (
            <div className="bucketlist-items-stack">
              {items.map((item, index) => {
                const voteState = getItemVoteState?.(item) ?? { voteScore: 0, userVote: null };

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: index * 0.03, duration: 0.22 }}
                  >
                    <BucketListItemCard
                      item={item}
                      isSelected={item.id === selectedItemId}
                      onSelect={() => onSelectItem(item.id)}
                      onDoubleSelect={() => onDoubleSelectItem?.(item.id)}
                      onReactionUpdate={onReactionUpdate}
                      voteScore={voteState.voteScore}
                      userVote={voteState.userVote}
                      isVoting={isVotingItemId === item.id}
                      onUpvote={() => onVote?.(item, "upvote")}
                      onDownvote={() => onVote?.(item, "downvote")}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}