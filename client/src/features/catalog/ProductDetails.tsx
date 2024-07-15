import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import NotFound from "../../app/api/errors/NotFound";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync} from "../basket/basketSlice";
import { fetchSingleProduct, productSelectors } from "./catalogSlice";

export default function ProductDetails(){
    const{basket,state}=useAppSelector(state=>state.basket)
    const dispatch=useAppDispatch()
    const {id}=useParams<string>()
    const product=useAppSelector(state=>productSelectors.selectById(state,parseInt(id!)))
    const {status}=useAppSelector(state=>state.catalog)
    const[quantity,setQuantity]=useState(0)
    const item=basket?.items.find(x=>x.productId===product?.id)

    function handleQuantityChange(event:ChangeEvent<HTMLInputElement>){
        if(parseInt(event.currentTarget.value)>=0)
            setQuantity(parseInt(event.currentTarget.value))
    }

    function handleSubmit(){
        if(!item||quantity>item.quantity){
            let delquant=quantity
            if(item)
                delquant=quantity-item.quantity
            dispatch(addBasketItemAsync({productId:product!.id,quantity:delquant}))
        }
        else{
            dispatch(removeBasketItemAsync({productId:product!.id,quantity:(item.quantity-quantity)}))
        }
    }

    useEffect(()=>{
        if(item)
            setQuantity(item.quantity)
        if(!product)
            dispatch(fetchSingleProduct(parseInt(id!)))
    },[id,item,product,dispatch])

    if(status=='loadingproduct') return <LoadingComponent message="Loading Product..."/>
    if(!product) return <NotFound/>
    return(
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody sx={{ fontSize: '1.1em' }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleQuantityChange}
                            variant={'outlined'}
                            type={'number'}
                            label={'Quantity in Cart'}
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={quantity==0||item?.quantity==quantity}
                            loading={state!='idle'}
                            onClick={handleSubmit}
                            sx={{ height: '55px' }}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            fullWidth>
                                {item?'Update quantity':'Add to basket'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}