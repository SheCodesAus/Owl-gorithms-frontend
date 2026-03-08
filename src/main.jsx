import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./pages/HomePage";
import BucketListsPage from "./pages/BucketListsPage";
import NavBar from "./components/NavBar";
import NotFound from "./pages/NotFoundPage";
import ItemCard from "./components/ItemCard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/",
        element: <HomePage /> },
      { path: "/bucketlist/:id",
        element: <BucketListsPage /> },
      { path: "/bucketitem/:id",
        element: <ItemCard /> },
      { path: "*",
        element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);