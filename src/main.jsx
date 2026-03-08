import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import BucketListsPage from "./pages/BucketListsPage";
import SingleListView from "./pages/SingleListView.jsx";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./components/AuthProvider.jsx"
import GoogleOAuthCallback from "./components/GoogleOAuthCallback.jsx";
import NotFound from "./pages/NotFoundPage";
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
      { path: "/register", element: <RegisterPage />},
      { path: "/dashboard", element: <AccountPage />},
      { path: "/oauth/google/callback", element: <GoogleOAuthCallback /> },
      { path: "/bucketlists", element: <BucketListsPage /> },
      { path: "/bucketlists/:id", element: <SingleListView /> },
      { path: "*", element: <NotFound /> },
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