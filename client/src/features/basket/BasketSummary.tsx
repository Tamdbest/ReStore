import { TableContainer, Paper, Table, TableBody, TableRow, TableCell} from "@mui/material";
import { getCurrency } from "../../app/util/util";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import { useAppSelector } from "../../app/store/configureStore";

export default function BasketSummary() {
    const{basket}=useAppSelector(state=>state.basket)
    const subtotal = basket?.items.reduce((total,item)=>total+(item.price*item.quantity),0)
    const deliveryFee = subtotal!>10000?0:800;
    if(!basket) return <LoadingComponent message="Oops! Your basket is empty"/>

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{getCurrency(subtotal!)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{getCurrency(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{getCurrency(subtotal! + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}