import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import { getCurrency } from "../../app/util/util";

interface Props{
    order:Order
    goBack:()=>void
}

export default function ViewOrder({order,goBack}:Props){
    return(
        <>
        <Grid><Typography variant="h3">{order.orderStatus}</Typography></Grid>
        <Grid container justifyContent="flex-end" sx={{mb:3}}>
            <Button variant='contained' size='large' onClick={goBack}>Go back</Button>
        </Grid>
        <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            {false&&
                            <TableCell align="right"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems.map((item) => (
                            <TableRow
                                key={item.name}
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
                                    {/* {false&&
                                    <LoadingButton
                                        color='error'
                                        loading={state==('pendingRemoveItem'+item.productId)}
                                        onClick={() => handleRemoveItem(item.productId, 1)}
                                    >
                                        <Remove />
                                    </LoadingButton>} */}
                                    {item.quantity}
                                    {/* {isBasket&&
                                    <LoadingButton
                                        loading={state==('pendingAddItem'+item.productId)}
                                        onClick={() => handleAddItem(item.productId)}
                                        color='secondary'
                                    >
                                        <Add />
                                    </LoadingButton>} */}
                                </TableCell>
                                <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    {/* {isBasket&&
                                    <LoadingButton
                                        loading={state==('pendingRemoveItem'+item.productId+'delload')}
                                        onClick={() => handleRemoveItem(item.productId, item.quantity,'delload')}
                                        color='error'
                                    >
                                        <Delete />
                                    </LoadingButton>} */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container sx={{mb:4}}>
                <Grid item xs={6}></Grid>
            <Grid item xs={6}>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{getCurrency(order.subtotal!)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{getCurrency(order.deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{getCurrency(order.subtotal! + order.deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            </Grid>
            </Grid>
            </>
    )
}