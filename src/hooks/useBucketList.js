import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import {
    getBucketList,
    updateBucketList,
    deleteBucketList,
    toggleFreezeList,
} from "../api/bucketlists";

export function useBucketList(bucketListId) {
    const { auth } = useAuth();
    const token = auth?.access ?? null;

    const [bucketList, setBucketList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bucketListError, setBucketListError] = useState("");

    const loadBucketList = useCallback(async () => {
        // bucketListId is required — token is optional (public lists don't need it)
        if (!bucketListId) return;

        setIsLoading(true);
        setBucketListError("");

        try {
            const data = await getBucketList(bucketListId, token);
            setBucketList(data);
        } catch (error) {
            setBucketListError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [bucketListId, token]);

    useEffect(() => {
        loadBucketList();
    }, [loadBucketList]);

    const editBucketList = async (updatedBucketListData) => {
        if (!token) throw new Error("User not logged in");
        if (!bucketListId) throw new Error("Bucket list not found");

        const updatedBucketList = await updateBucketList(
            bucketListId,
            updatedBucketListData,
            token
        );

        setBucketList(updatedBucketList);
        return updatedBucketList;
    };

    const removeBucketList = async () => {
        if (!token) throw new Error("User not logged in");
        if (!bucketListId) throw new Error("Bucket list not found");

        await deleteBucketList(bucketListId, token);
        setBucketList(null);
        return true;
    };

    const freezeBucketList = async (isFrozen) => {
        if (!token) throw new Error("User not logged in");
        if (!bucketListId) throw new Error("Bucket list not found");

        const updated = await toggleFreezeList(bucketListId, isFrozen, token);
        setBucketList(updated);
        return updated;
    };

    return {
        bucketList,
        isLoading,
        bucketListError,
        loadBucketList,
        editBucketList,
        removeBucketList,
        freezeBucketList,
    };
}