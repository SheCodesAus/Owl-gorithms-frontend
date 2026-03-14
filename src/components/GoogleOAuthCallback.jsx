import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { completeLogin } from "../utils/completeLogin";

function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    async function finishGoogleLogin() {
      if (!access) {
        navigate("/login");
        return;
      }

      try {
        localStorage.setItem("access", access);
        if (refresh) {
          localStorage.setItem("refresh", refresh);
        }

        await completeLogin({
          access,
          refresh,
          setAuth,
          navigate,
        });
      } catch (error) {
        navigate("/login");
      }
    }

    finishGoogleLogin();
  }, [navigate, setAuth]);

  return <p className="mt-20 text-center">Logging in with Google...</p>;
}

export default GoogleOAuthCallback;