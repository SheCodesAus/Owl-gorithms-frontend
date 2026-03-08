import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import BucketListsPage from "./pages/BucketListsPage";
import SingleListView from "./pages/SingleListView";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import NotFound from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/bucketlists/:id", element: <BucketListsPage /> },
      { path: "/login", element: <LoginPage />},
      { path: "/register", element: <RegisterPage/> },
      { path: "/bucketlists/:id", element: <SingleListView /> },
      { path: "*",  element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);