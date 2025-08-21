import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PostProduct from "../post-product";
import Shopprofile from "../ShopProfile/Createshop";
import Productlist from "../post-product/Productlist";
import Profile from "../ShopProfile/Profile";
import Layout from "../layout/Layout";
import RegisterForm from "../authentication/Register";
import LoginForm from "../authentication/Login";

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
      // หน้าแรกให้เป็น index route แทนการใส่ path: "/"
      { index: true, element: <LoginForm /> },

      // ใช้ชื่อ path ให้คงที่/เป็นตัวเล็กทั้งหมด
      { path: "create-post", element: <PostProduct /> },
      { path: "create-profile", element: <Shopprofile /> },
      { path: "product-list", element: <Productlist /> },   // ✅ แก้ชื่อสวยและจำง่าย
      { path: "register", element: <RegisterForm /> },
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

      // not found ในระดับ children
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
