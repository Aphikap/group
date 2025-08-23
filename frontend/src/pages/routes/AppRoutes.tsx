
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PostProduct from "../post-product";
import Shopprofile from "../ShopProfile/Createshop";
import Productlist from "../post-product/Productlist";
import Profile from "../ShopProfile/Profile";
import Layout from "../layout/Layout";
import RegisterForm from "../authentication/Register";
import LoginForm from "../authentication/Login";
import ProtectRouteUser from "./ProtectRouteUser";

const demoProducts = [
  { id: 1, name: "เสื้อเชิ้ตผู้ชาย", category: "เสื้อผ้าแฟชั่น", price: 350, image: "/img2.jpg" },
  { id: 2, name: "หูฟัง Bluetooth", category: "อิเล็กทรอนิกส์", price: 900, image: "/img3.jpg" },
  { id: 3, name: "น้ำพริกปลาร้า", category: "อาหาร", price: 80, image: "/img4.jpg" },
];

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
      {
        path: "profile",
        element: (
          <Profile
            shopName="SUT Market"
            slogan="ส่งไว ราคาน่ารัก"
            description="ร้านของเรามีสินค้าหลากหลาย ทั้งแฟชั่น ไอที และของใช้จำเป็น"
            logoUrl="/img1.jpg"
            categories={["เสื้อผ้าแฟชั่น", "อิเล็กทรอนิกส์", "อาหาร"]}
            products={demoProducts}
          />
        ),
      },
      { path: "*", element: <Navigate to="/user" replace /> },
    ],
  },
]);


export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
