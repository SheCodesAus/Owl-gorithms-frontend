import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Optionally fetch user info from backend
      fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      })
        .then((res) => res.json())
        .then((user) => {
          setAuth({ access, refresh, user });
          navigate("/dashboard"); // redirect to dashboard
        })
        .catch(() => {
          // If fetching user fails, still redirect
          navigate("/");
        });
    } else {
      // If no access token, redirect to login
      navigate("/login");
    }
  }, []);

  return <p className="text-center mt-20">Logging in with Google...</p>;
}

export default GoogleOAuthCallback;
