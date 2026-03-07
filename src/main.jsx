import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";

import { AuthProvider } from "./components/AuthProvider.jsx"
import GoogleOAuthCallback from "./components/GoogleOAuthCallback.jsx";
import "./main.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
      <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage />},
      { path: "/dashboard", element: <AccountPage />},
      { path: "/oauth/google/callback", element: <GoogleOAuthCallback /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);