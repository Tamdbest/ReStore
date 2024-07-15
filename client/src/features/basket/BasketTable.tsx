import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

interface Props{
    items:BasketItem[],
    isBasket?:boolean
}

export default function BasketTable({items,isBasket=true}:Props){
    const{state}=useAppSelector(state=>state.basket)
    const dispatch=useAppDispatch()
    function handleAddItem(productId:number){
        dispatch(addBasketItemAsync({productId:productId}))
    }
    function handleRemoveItem(productId:number,quantity:number=1,delload:string=''){
        dispatch(removeBasketItemAsync({productId:productId,quantity:quantity,delload:delload}))
    }
    return(
        <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            {isBasket&&
                            <TableCell align="right"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img style={{ height: 50, marginRight: 20 }} src={item.pictureUrl} alt={item.name} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    {isBasket&&
                                    <LoadingButton
                                        color='error'
                                        loading={state==('pendingRemoveItem'+item.productId)}
                                        onClick={() => handleRemoveItem(item.productId, 1)}
                                    >
                                        <Remove />
                                    </LoadingButton>}
                                    {item.quantity}
                                    {isBasket&&
                                    <LoadingButton
                                        loading={state==('pendingAddItem'+item.productId)}
                                        onClick={() => handleAddItem(item.productId)}
                                        color='secondary'
                                    >
                                        <Add />
                                    </LoadingButton>}
                                </TableCell>
                                <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    {isBasket&&
                                    <LoadingButton
                                        loading={state==('pendingRemoveItem'+item.productId+'delload')}
                                        onClick={() => handleRemoveItem(item.productId, item.quantity,'delload')}
                                        color='error'
                                    >
                                        <Delete />
                                    </LoadingButton>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    )
}