import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import postLogin from "../api/post-login";
import { useAuth } from "../hooks/use-auth";
import { completeLogin } from "../utils/completeLogin";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { id, value } = event.target;

    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});

    try {
      const response = await postLogin(
        credentials.username,
        credentials.password
      );

      const access = response.access;
      const refresh = response.refresh;

      window.localStorage.setItem("access", access);
      if (refresh) {
        window.localStorage.setItem("refresh", refresh);
      }

      await completeLogin({
        access,
        refresh,
        setAuth,
        navigate,
      });
    } catch (error) {
      setErrors({
        non_field_errors: [error.message],
      });
    }
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {errors.non_field_errors && (
            <p className="text-sm text-red-500">
              {errors.non_field_errors.join(" ")}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-700 py-2 font-semibold text-white transition hover:bg-purple-800"
          >
            Log In
          </button>
        </form>

        <div className="my-4 text-center text-sm text-gray-500">or</div>

        <GoogleLogin />
      </div>
    </div>
  );
}

export default LoginPage;
