import { Button, Grid, Typography,} from "@mui/material"
import BasketSummary from "./BasketSummary"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/store/configureStore"
import BasketTable from "./BasketTable"

export default function BasketPage(){
    const{basket}=useAppSelector(state=>state.basket)
    if(!basket) return <Typography variant='h3'>Oops! Couldn't fetch basket</Typography>
    return (
        <>
            <BasketTable items={basket.items} isBasket={true}/>
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary/>
                    <Button component={Link} to='/checkout' variant='contained' size='large' fullWidth>Checkout</Button>
                </Grid>
            </Grid>
        </>
)}