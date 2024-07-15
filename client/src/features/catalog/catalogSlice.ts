import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState{
    productsLoaded:boolean
    status:string
    filtersLoaded:boolean
    brands:[]
    types:[]
    productParams:ProductParams
    metaData:MetaData|null
}

function getURLParams(productParams:ProductParams){
    const params=new URLSearchParams();
    params.append('OrderBy',productParams.orderBy);
    params.append('PageNumber',productParams.pageNumber.toString());
    params.append('pageSize',productParams.pageSize.toString());
    if(productParams.searchTerm&&productParams.searchTerm.length>0)
        params.append('SearchTerm',productParams.searchTerm);
    if(productParams.brands&&productParams.brands.length>0)
        params.append('Brands',productParams.brands.toString());
    if(productParams.types&&productParams.types.length>0)
        params.append('Types',productParams.types.toString())
    return params;
}

export const productsAdapter=createEntityAdapter<Product>()

export const fetchProducts=createAsyncThunk<Product[],void,{state:RootState}>(
    'catalog/fetchProducts',
    async(_,thunkAPI)=>{
        const params=getURLParams(thunkAPI.getState().catalog.productParams)
        try{
            const response=await agent.Catalog.list(params)
            thunkAPI.dispatch(setMetaData(response.metaData))
            return response.items;
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err})
        }
    }
)

export const fetchSingleProduct=createAsyncThunk<Product,number>(
    'catalog/fetchSingleProduct',
    async(productId:number,thunkAPI)=>{
        try{
            return await agent.Catalog.details(productId);
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err})
        }
    }
)

export const fetchFilters=createAsyncThunk(
    'catalog/fetchFilters',
    async(_,thunkAPI)=>{
        try{
            return await agent.Catalog.filters();
        }
        catch(err:any){
            return thunkAPI.rejectWithValue({error:err.data});
        }
    }
)

function initParams(){
    return {
        orderBy:'',
        pageNumber:1,
        pageSize:6
    }
}

export const catalogSlice=createSlice({
    name:'catalog',
    initialState:productsAdapter.getInitialState<CatalogState>({
        productsLoaded:false,
        status:'idle',
        filtersLoaded:false,
        brands:[],
        types:[],
        productParams:initParams(),
        metaData:null
    }),
    reducers:{
        setProdParams:(state,action)=>{
            state.productsLoaded=false;
            state.productParams={...state.productParams,...action.payload}
        },
        resetProdparams:(state)=>{
            state.productParams=initParams()
        },
        setMetaData:(state,action)=>{
            state.metaData=action.payload
            state.productParams.pageNumber=1
        }
    },
    extraReducers:builder=>{
        builder.addCase(fetchProducts.pending,(state)=>{
            state.status='fetchingall'
        });
        builder.addCase(fetchProducts.fulfilled,(state,action)=>{
            productsAdapter.setAll(state,action.payload)
            state.status='idle'
            state.productsLoaded=true
        });
        builder.addCase(fetchProducts.rejected,(state,action)=>{
            console.log(action)
            state.status='idle'
        });
        builder.addCase(fetchSingleProduct.pending,(state)=>{
            state.status='fetchingproduct'
        });
        builder.addCase(fetchSingleProduct.fulfilled,(state,action)=>{
            productsAdapter.upsertOne(state,action.payload)
            state.status='idle'
        });
        builder.addCase(fetchSingleProduct.rejected,(state,action)=>{
            console.log(action);
            state.status='idle'
        });
        builder.addCase(fetchFilters.pending,(state)=>{
            state.status='loadingFilters'
        });
        builder.addCase(fetchFilters.fulfilled,(state,action)=>{
            state.brands=action.payload.brands;
            state.types=action.payload.types;
            state.status='idle';
            state.filtersLoaded=true;
        });
        builder.addCase(fetchFilters.rejected,(state,action)=>{
            state.status='idle';
            console.log(action)
        })
    }
})

export const productSelectors=productsAdapter.getSelectors((state:RootState)=>state.catalog);

export const{setProdParams,resetProdparams,setMetaData}=catalogSlice.actions;