import { useAuth } from "./use-auth";
import {
    submitVote,
    removeVote,
} from "../api/votes";
import { remove } from "three/examples/jsm/libs/tween.module.js";

export function useVotes() {
    const { auth } = useAuth();
    const token = auth?.access;

    const voteOnItem = async (ItemId, voteType) => {
        if (!token) throw new Error("User not logged in");

        return submitVote(ItemId, voteType, token);
    };

    const clearVote = async (itemId) => {
        if (!token) throw new Error("User not logged in");

        return removeVote(itemId, token);
    };

    return { voteOnItem, clearVote };
}