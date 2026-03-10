import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import {
    getItems,
    createItem,
} from "../api/items";

export function useItems(bucketListId) {
    const { auth } = useAuth();
    const token = auth?.access;

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itemsError, setItemsError] = useState("");

    const loadItems = useCallback(async () => {
        if (!token || !bucketListId) return;

        setIsLoading(true);
        setItemsError("");

        try {
            const data = await getItems(bucketListId, token);
            setItems(data);
        } catch (error) {
            setItemsError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [bucketListId, token]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const addItem = async (data) => {
        if (!token) throw new Error("User not logged in");
        if (!bucketListId) throw new Error("Bucket list not found");

        const newItem = await createItem(bucketListId, data, token);

        setItems((currentItems) => [newItem, ...currentItems]);

        return newItem;
    };

    return {
        items,
        isLoading,
        itemsError,
        loadItems,
        addItem,
    };
}