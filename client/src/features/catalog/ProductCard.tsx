import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import { Product } from "../../app/models/product"
import { Link } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { getCurrency } from "../../app/util/util"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { addBasketItemAsync} from "../basket/basketSlice"

interface Props{
    product:Product
}

export default function ProductCard({product}:Props){
    const{state}=useAppSelector(state=>state.basket)
    const dispatch=useAppDispatch()
    // function AddToCart(productId:number){
    //     setLoading(true);
    //     agent.Basket.addToBasket(productId)
    //         .then(x=>dispatch(add))
    //         .catch(err=>console.log(err))
    //         .finally(()=>setLoading(false))
    // }

    return(
        <Card sx={{mt:2}}>
            <CardHeader avatar={
                <Avatar sx={{bgcolor:'secondary.main'}}>{product.name.charAt(0).toUpperCase()}</Avatar>
            } title={product.name}
            titleTypographyProps={{
                sx:{fontWeight:'bold',color:'primary.main'}
            }}/>
            <CardMedia
                sx={{height :140,backgroundSize:'contain',bgcolor:'primary.light'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5" component="div">
                    {getCurrency(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={state==('pendingAddItem'+product.id)} onClick={()=>dispatch(addBasketItemAsync({productId:product.id}))} size="small">Add to cart</LoadingButton>
                <Button size="small" component={Link} to={`/catalog/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}