// src/store/ecom-store.ts
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LoginRequest } from "../../interfaces/Login";

// ต้อง forward useEcomStore เพื่อใช้ใน clearPersistedStore
let useEcomStore: any;

const ecomstore = (set: any) => ({
  user: null,
  token: null,
  hasShop: null,

  // ✅ แก้ไข: เคลียร์ token ทันทีเมื่อ login ผิด
  actionLogin: async (values: LoginRequest) => {
    try {
      // 1) login
      const res = await axios.post("http://localhost:8080/api/login", values);

      const token = res.data?.token;
      const payload = res.data?.payload;

      // เก็บลง store ก่อน
      set({
        user: payload || null,
        token: token || null,
        hasShop: null,
      });

      // 2) current-user
      let has = false;
      if (token) {
        const me = await axios.get("http://localhost:8080/api/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        has = !!me.data?.has_shop;
        set({ hasShop: has });
      }

      return { res, hasShop: has };
    } catch (error) {
      // ❌ login fail → เคลียร์ state
      set({ user: null, token: null, hasShop: null });
      throw error;
    }
  },

  // ✅ ปรับ logout ให้ล้าง state อย่างเดียว
  logout: () => {
    set({ user: null, token: null, hasShop: null });
  },

  // ✅ เพิ่ม: ฟังก์ชันล้างทั้ง storage และ state
  clearPersistedStore: () => {
    useEcomStore.persist.clearStorage(); // ล้าง localStorage
    set({ user: null, token: null, hasShop: null }); // ล้างในหน่วยความจำ
  },
});

// ส่วน persist เหมือนเดิม
const userPersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
};

// ✅ สร้าง store แล้วผูกกลับให้ใช้ใน clearPersistedStore ได้
useEcomStore = create(persist(ecomstore, userPersist));
export default useEcomStore;
