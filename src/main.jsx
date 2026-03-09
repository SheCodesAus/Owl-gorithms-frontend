import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './main.css'
import HomePage from "./pages/HomePage";
import BucketListsPage from "./pages/BucketListsPage";
import SingleListView from "./pages/SingleListView";
import ItemDetailPage from "./pages/ItemDetailPage";
import NavBar from "./components/NavBar";
import NotFound from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/bucketlist/:id", element: <BucketListsPage /> },

      { path: "/preview", element: <SingleListView /> },
      { path: "/item/:id", element: <ItemDetailPage /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)