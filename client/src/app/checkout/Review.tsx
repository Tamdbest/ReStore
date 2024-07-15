import { Typography, Grid,} from '@mui/material';
import BasketSummary from '../../features/basket/BasketSummary';
import BasketTable from '../../features/basket/BasketTable';
import { useAppSelector } from '../store/configureStore';


export default function Review() {
  const{basket}=useAppSelector(state=>state.basket)
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket&&
      <BasketTable items={basket.items} isBasket={false}/>}
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary/>
                </Grid>
            </Grid>
    </>
  );
}
