import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import getUser from "../api/get-user";

export default function useUser() {
    const { auth } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchUser = async () => {
        const token = auth.access || window.localStorage.getItem("access");

        if (!token) {
            setIsLoading(false);
            setError(new Error("Not logged in"));
            return;
        }

        try {
            const userData = await getUser(token);
            setUser(userData);
        } catch (err) {
            // Clear token if invalid to avoid repeated 401s
            if (err.message.includes("401")) {
                window.localStorage.removeItem("access");
            }
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchUser();
}, [auth.access]);


    return { user, isLoading, error };
}