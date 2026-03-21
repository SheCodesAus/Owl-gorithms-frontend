import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import InviteAcceptPage from "./pages/InviteAcceptPage.jsx";

import { AuthProvider } from "./components/AuthProvider.jsx"
import { BannerProvider } from "./components/UI/BannerProvider.jsx";
import { NotificationsProvider } from "./components/NotificationsProvider.jsx";
import GoogleOAuthCallback from "./components/GoogleOAuthCallback.jsx";
import NotFound from "./pages/NotFoundPage";

// New pages
import BucketListItemPage from "./pages/BucketListItemPage.jsx";
import SingleListView from "./pages/SingleListView.jsx";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/dashboard", element: <AccountPage /> },
      { path: "/bucketlists/:listId/items/:itemId", element: <BucketListItemPage /> },
      { path: "/bucketlists/:id", element: <SingleListView /> },
      { path: "*", element: <NotFound /> },
      { path: "/oauth/google/callback", element: <GoogleOAuthCallback /> },
      { path: "/invites/:token", element: <InviteAcceptPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BannerProvider>
        <NotificationsProvider>
      <RouterProvider router={router} />
      </NotificationsProvider>
      </BannerProvider>
    </AuthProvider>
  </React.StrictMode>
);