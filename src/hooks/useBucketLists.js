import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import {
    getBucketLists,
    createBucketList,
    updateBucketList,
    deleteBucketList,
} from "../api/bucketlists";

export function useBucketLists() {
    const { auth } = useAuth();
    const token = auth?.access;

    const [bucketLists, setBucketLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bucketListsError, setBucketListsError] = useState("");

    const loadBucketLists = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setBucketListsError("");

        try {
            const data = await getBucketLists(token);
            setBucketLists(data);
        } catch (error) {
            setBucketListsError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadBucketLists();
    }, [loadBucketLists]);

    const addBucketList = async (bucketListData) => {
        if (!token) throw new Error("User not logged in");

        const newBucketList = await createBucketList(bucketListData, token);
        setBucketLists((currentBucketLists) => [
            newBucketList,
            ...currentBucketLists,
        ]);

        return newBucketList;
    };

    const editBucketList = async (bucketListId, updatedBucketListData) => {
        if (!token) throw new Error("User not logged in");

        const updatedBucketList = await updateBucketList(
            bucketListId,
            updatedBucketListData,
            token
        );

        setBucketLists((currentBucketLists) =>
            currentBucketLists.map((bucketList) =>
                bucketList.id === bucketListId
                    ? updatedBucketList
                    : bucketList
            )
        );

        return updatedBucketList;
    };

    const removeBucketList = async (bucketListId) => {
        if (!token) throw new Error("User not logged in");

        await deleteBucketList(bucketListId, token);

        setBucketLists((currentBucketLists) =>
            currentBucketLists.filter(
                (bucketList) => bucketList.id !== bucketListId
            )
        );

        return true;
    };

    return {
        bucketLists,
        isLoading,
        bucketListsError,
        loadBucketLists,
        addBucketList,
        editBucketList,
        removeBucketList,
    };
}