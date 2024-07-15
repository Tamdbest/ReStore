import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

interface BasketState{
    basket:Basket|null;
    state:string;
}
const initialState:BasketState={basket:null,state:'idle'}

export const addBasketItemAsync=createAsyncThunk<Basket,{productId:number,quantity?:number}>(
    'basket/addBasketItemAsync',
    async({productId,quantity=1},thunkAPI)=>{
        try{
            return await agent.Basket.addToBasket(productId,quantity)
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err.data})
        }
    }
)

export const removeBasketItemAsync=createAsyncThunk<null,{productId:number,quantity?:number,delload?:string}>(
    'basket/removeBasketItemAsync',
    async({productId,quantity=1},thunkAPI)=>{
        try{
            return await agent.Basket.removeFromBasket(productId,quantity)
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err.data})
        }
    }
)

export const fetchBasketAsync=createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async(_,thunkAPI)=>{
        try{
            return agent.Basket.getBasket()
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err.data})
        }
    },
    {
        condition:()=>{
            if(!getCookie("buyerId"))
                return false;
        }
    }
)

export const basketSlice=createSlice({
    name:'basket',
    initialState,
    reducers:{
        setBasket:(state,action)=>{
            state.basket=action.payload
        },
        removeItem:(state,action)=>{
            if(state.basket){
                const idx=state.basket.items.findIndex(x=>x.productId==action.payload.productId)
                if(idx===-1)
                    return;
                state.basket.items[idx].quantity-=action.payload.quantity
                if(state.basket.items[idx].quantity==0){
                    state.basket.items.splice(idx,1)
                }
            }
        },
        removeBasket:(state)=>{
            state.basket=null;
        }
    },
    extraReducers:builder=>{
        builder.addCase(addBasketItemAsync.pending,(state,action)=>{
            state.state='pendingAddItem'+action.meta.arg.productId;
        }),
        builder.addCase(addBasketItemAsync.fulfilled,(state,action)=>{
            state.basket=action.payload
            state.state='idle'
        }),
        builder.addCase(addBasketItemAsync.rejected,(state,action)=>{
            state.state='idle'
            console.log(action)
        }),
        builder.addCase(removeBasketItemAsync.pending,(state,action)=>{
            state.state='pendingRemoveItem'+action.meta.arg.productId+action.meta.arg.delload;
        }),
        builder.addCase(removeBasketItemAsync.fulfilled,(state,action)=>{
            //state.basket=action.payload
            if(state.basket){
                const idx=state.basket.items.findIndex(x=>x.productId==action.meta.arg.productId)
                if(idx===-1)
                    return;
                state.basket.items[idx].quantity-=action.meta.arg.quantity!
                if(state.basket.items[idx].quantity==0){
                    state.basket.items.splice(idx,1)
                }
            }
            state.state='idle'
        }),
        builder.addCase(removeBasketItemAsync.rejected,(state,action)=>{
            state.state='idle'
            console.log(action)
        }),
        builder.addCase(fetchBasketAsync.fulfilled,(state,action)=>{
            state.basket=action.payload
        }),
        builder.addCase(fetchBasketAsync.rejected,(action)=>{
            console.log(action)
        })
    }
})

export const{setBasket,removeItem,removeBasket}=basketSlice.actions;