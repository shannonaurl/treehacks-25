import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Book from "./components/Book.jsx";
import Share from "./components/Share.jsx";

const router = createBrowserRouter([
    {
        exact: true,
        path: "/",
        element: <App />,
    },
    {
        exact: true,
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/book",
        element: <Book />,
    },
    {
        path: "/share",
        element: <Share />,
    },
]);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <Auth0Provider
        domain="dev-3eayae31z7ls84il.ca.auth0.com"
        clientId="r5LroNz0mqWWemrNxxos1ypAZLTXi2ZM"
        authorizationParams={{
            redirect_uri: "http://localhost:5173/dashboard",
        }}
    >
        <RouterProvider router={router} />
    </Auth0Provider>
);
