import { configureStore } from "@reduxjs/toolkit";
import { basketSlice } from "../../features/basket/basketSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/accountslice";

export const store=configureStore({
    reducer:{
        basket:basketSlice.reducer,
        catalog:catalogSlice.reducer,
        account:accountSlice.reducer,
    }
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export const useAppDispatch=()=>useDispatch<AppDispatch>();
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;