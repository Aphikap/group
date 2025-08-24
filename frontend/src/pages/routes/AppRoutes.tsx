
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PostProduct from "../post-product";
import Shopprofile from "../ShopProfile/Createshop";
import Productlist from "../post-product/Productlist";
import Profile from "../ShopProfile/Profile";
import Layout from "../layout/Layout";
import RegisterForm from "../authentication/Register";
import LoginForm from "../authentication/Login";
import ProtectRouteUser from "./ProtectRouteUser";
import EditShopProfile from "../ShopProfile/EditShopProfile/EditShopProfile";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Productlist /> },
      { path: "login", element: <LoginForm /> },

      { path: "register", element: <RegisterForm /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: "/user",
    element: <ProtectRouteUser element={<Layout />} />,
    children: [
      { index: true, element: <Productlist /> },
      { path: "create-post", element: <PostProduct /> },
      { path: "create-profile", element: <Shopprofile /> },
      {path: "profile",element:<Profile/>},
      {path: "profile/edit",element:<EditShopProfile/>},
      { path: "*", element: <Navigate to="/user" replace /> },
    ],
  },
]);


export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
