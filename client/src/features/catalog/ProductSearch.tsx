import { Paper, TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useState } from "react";
import { setProdParams } from "./catalogSlice";

export default function ProductSearch(){
    const {productParams}=useAppSelector(state=>state.catalog)
    const dispatch=useAppDispatch()
    const[searchTerm,setSearchTerm]=useState(productParams.searchTerm)
    const debouncedSearch=debounce((event:any)=>{
        dispatch(setProdParams({searchTerm:event.target.value}))
    },1000)

    return(
        <Paper sx={{mb:2}}>
            <TextField 
                label='Search Products' variant='outlined' fullWidth value={searchTerm} 
                onChange={(event)=>{
                    setSearchTerm(event.target.value)
                    debouncedSearch(event)
                }}/>
        </Paper>
    )
}