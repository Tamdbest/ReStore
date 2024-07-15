import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props{
    metaData:MetaData;
    onPageChange:(page:number)=>void
}
export default function AppPagination({metaData,onPageChange}:Props){
    const {totalCount,totalPages,pageSize,currentPage}=metaData
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{mb:2}}>
            <Typography>
                Displaying {(currentPage-1)*pageSize+1}-{(currentPage*pageSize)>totalCount?totalCount:(currentPage*pageSize)} of {totalCount} items
            </Typography>
            <Pagination count={totalPages} color="secondary" size='large' page={currentPage}
                onChange={(_e,page:number)=>onPageChange(page)}/>
        </Box>
    )
}