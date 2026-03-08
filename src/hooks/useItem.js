import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import {
    getItem,
    updateItem,
    deleteItem,
} from "../api/items";

export function useItem(itemId) {
    const { auth } = useAuth();
    const token = auth?.access;

    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [itemError, setItemError] = useState("");

    const loadItem = useCallback(async () => {
        if (!token || !itemId) return;

        setIsLoading(true);
        setItemError("");

        try {
            const data = await getItem(itemId, token);
            setItem(data);
        } catch (error) {
            setItemError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [itemId, token]);

    useEffect(() => {
        loadItem();
    }, [loadItem]);

    const editItem = async (updatedItemData) => {
        if (!token) throw new Error("User not logged in");
        if (!itemId) throw new Error("Item not found");

        const updatedItem = await updateItem(itemId, updatedItemData, token);

        setItem(updatedItem);

        return updatedItem;
    };

    const removeItem = async () => {
        if (!token) throw new Error("User not logged in");
        if (!itemId) throw new Error("Item not found");

        await deleteItem(itemId, token);
        setItem(null);

        return true;
    };

    return {
        item,
        isLoading,
        itemError,
        loadItem,
        editItem,
        removeItem,
    };
}