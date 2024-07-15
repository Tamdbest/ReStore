import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue{
    basket:Basket|null
    setBasket:(basket:Basket)=>void
    removeItem:(productId:number,quantity:number)=>void
}

export const StoreContext=createContext<StoreContextValue|undefined>(undefined);

export function useStoreContext(){
    const context=useContext(StoreContext)
    if(context==undefined)
        throw Error("Oops! you're out of context");
    return context;
}
export function StoreProvider({children}:PropsWithChildren<unknown>){
    const[basket,setBasket]=useState<Basket|null>(null)
    function removeItem(productId:number,quantity:number){
        if(!basket)
            return;
        const items=[...basket.items]
        const idx=items.findIndex(x=>x.productId==productId)
        items[idx].quantity-=quantity
        if(items[idx].quantity<=0)
            items.splice(idx,1)
        setBasket(prevState=>{
            return {...prevState!,items}
        })
    }
    return (
        <StoreContext.Provider value={{basket,setBasket,removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}