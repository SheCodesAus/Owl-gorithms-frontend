import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        access: window.localStorage.getItem("access") || null,
        user: null,
    });
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = window.localStorage.getItem("access");
        if (!token) {
            setAuthChecked(true);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(async (response) => {
            if (!response.ok) {
                window.localStorage.removeItem("access");
                setAuth({ access: null, user: null });
            } else {
                const userData = await response.json();
                setAuth({ access: token, user: userData });
            }
        })
        .finally(() => setAuthChecked(true));
    }, []);

    if (!authChecked) return null;

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
}