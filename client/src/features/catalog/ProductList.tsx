import { Grid, } from "@mui/material"
import { Product } from "../../app/models/product"
import ProductCard from "./ProductCard"
import { useAppSelector } from "../../app/store/configureStore"
import ProductCardSkeleton from "./ProductCardSkeleton"

interface Props{
    products:Product[]
}

export default function ProductList({products}:Props){
    const {productsLoaded}=useAppSelector(state=>state.catalog)
    return (
        <Grid container columnSpacing={4}>
            {products.map(product=>(
                <Grid item key={product.id} xs={4}>
                    {productsLoaded?<ProductCard product={product}/>:<ProductCardSkeleton/>}
                </Grid>
            ))}
        </Grid>
    )    
}