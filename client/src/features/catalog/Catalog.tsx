import ProductList from "./ProductList"
import { useEffect} from "react"
import LoadingComponent from "../../app/layouts/LoadingComponent"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { fetchFilters, fetchProducts, productSelectors, setProdParams } from "./catalogSlice"
import { FormControl, FormLabel, Grid, Paper,} from "@mui/material"
import ProductSearch from "./ProductSearch"
import RadioButtonGroup from "../../app/components/RadioButtonGroup"
import ReusableCheckBox from "../../app/components/ReusableCheckBox"
import AppPagination from "../../app/components/AppPagination"

export default function Catalog(){
    const products=useAppSelector(productSelectors.selectAll)
    const {productsLoaded,filtersLoaded,brands,types,productParams,metaData}=useAppSelector(state=>state.catalog)
    const dispatch=useAppDispatch()
    const sortOptions=[{value:'',label:'Alphabetical'},{value:'price',label:'Price - Low to High'},
        {value:'priceDesc',label:'Price - High to Low'}]
  
    useEffect(()=>{
        if(!productsLoaded){
            dispatch(fetchProducts())
        }  
    },[productsLoaded,dispatch])

    useEffect(()=>{
        if(!filtersLoaded)
            dispatch(fetchFilters())
    },[dispatch,filtersLoaded])

    
    if(!filtersLoaded) return <LoadingComponent message="Loading products..."/>

    return(
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <ProductSearch/>
                <Paper sx={{mb:2,p:2}}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Sort By</FormLabel>
                            <RadioButtonGroup defVal={productParams.orderBy} 
                            options={sortOptions} onChange={(e)=>dispatch(setProdParams({orderBy:e.target.value}))}/>
                    </FormControl>
                </Paper>
                <Paper sx={{mb:2,p:2}}>
                    <ReusableCheckBox items={brands} checkedItems={productParams.brands} 
                        onChange={(arr)=>dispatch(setProdParams({brands:arr}))}/>                          
                </Paper>
                <Paper sx={{mb:2,p:2}}>
                    <ReusableCheckBox items={types} checkedItems={productParams.types} 
                        onChange={(arr)=>dispatch(setProdParams({types:arr}))}/>                          
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products}/>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={9} sx={{mb:2}}>{metaData&&
                    <AppPagination metaData={metaData} onPageChange={(page:number)=>dispatch(setProdParams({pageNumber:page}))}/>
                }
            </Grid>
        </Grid>
    )
}