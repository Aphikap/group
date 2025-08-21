import { create } from "zustand";

const ecomstore =(set)=>({
    user:null,
    tokene:null,
    actionLogin:()=>{

    },

})

const useEcomStore = create(ecomstore)

export default useEcomStore