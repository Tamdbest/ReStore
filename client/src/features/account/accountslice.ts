import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { routes } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

export interface AccountState{
    user:User|null
}
export const initialState:AccountState={user:null}

export const signIn=createAsyncThunk<User,FieldValues>(
    'account/signIn',
    async(data:FieldValues,thunkAPI)=>{
        try{
            const {basket,...user}=await agent.Account.login(data)
            thunkAPI.dispatch(setBasket(basket))
            localStorage.setItem('user',JSON.stringify(user))
            return user
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err.data})
        }
    }
)

export const getCurrUser=createAsyncThunk<User>(
    'account/getCurrUser',
    async(_,thunkAPI)=>{
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try{
            const {basket,...user}=await agent.Account.currentUser()
            thunkAPI.dispatch(setBasket(basket))
            localStorage.setItem('user',JSON.stringify(user))
            return user
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:'Unauthorized!'})
        }
    },
    {
        condition:()=>{
            if(!localStorage.getItem('user'))
                return false
        }
    }
)

export const accountSlice=createSlice({
    name:'account',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null
            localStorage.removeItem('user')
            toast.success('You have been logged out successfully!')
            routes.navigate('/')
        },
        setUser:(state,action)=>{
            state.user=action.payload
        }
    },
    extraReducers:builder=>{
        builder.addCase(getCurrUser.rejected,(state)=>{
            state.user=null,
            localStorage.removeItem('user')
            toast.error('Your session has expired, please login again!')
            routes.navigate('/')
        })
        builder.addMatcher(isAnyOf(signIn.fulfilled,getCurrUser.fulfilled),(state,action)=>{
            state.user=action.payload
        })
        builder.addMatcher(isAnyOf(signIn.rejected),(_state,action)=>{
            console.log(action)
        })
    }
})

export const {logout,setUser}=accountSlice.actions;