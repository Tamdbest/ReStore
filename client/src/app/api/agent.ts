import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { routes } from "../router/Routes";
import { PaginatedClass } from "../models/pagination";
import { store } from "../store/configureStore";
const loading=()=>new Promise(x=>setTimeout(x,500));

axios.defaults.baseURL=import.meta.env.VITE_API_URL;
axios.defaults.withCredentials=true;

axios.interceptors.request.use(config=>{
    const token=store.getState().account.user?.token;
    if(token)
        config.headers.Authorization=`Bearer ${token}`
    return config
})

axios.interceptors.response.use(async response=>{
    if(import.meta.env.DEV)
        await loading();
    const pagination=response.headers['pagination'];
    if(pagination){
        response.data=new PaginatedClass(response.data,JSON.parse(pagination))
    }
    return response;
},(err:AxiosError)=>{
    const{data,status}=err.response as AxiosResponse;
    // if(status==401){
    //     toast.error('Unauthorized!')
    // }
    if(data)
        toast.error(data.title)
    if(status==500){
        routes.navigate('server-error',{state:{error:data}})
    }
    if(status==400){
        if(data.errors!==null){
            const modelErrors:string[]=[]
            for(const key in data.errors){
                modelErrors.push(data.errors[key])
            }
            throw modelErrors.flat()
        }
    }
    return Promise.reject(err.response)
})

const responseBody = (response:AxiosResponse)=>response.data;

const requests={
    get:(url:string,params?:URLSearchParams)=>axios.get(url,{params}).then(responseBody),
    post:(url:string,body:object)=>axios.post(url,body).then(responseBody),
    put:(url:string,body:object)=>axios.put(url,body).then(responseBody),
    delete:(url:string)=>axios.delete(url).then(responseBody)
}

const Catalog={
    list:(params:URLSearchParams)=>requests.get('products',params),
    details:(id:number)=>requests.get(`products/${id}`),
    filters:()=>requests.get('products/filters')
}

const Basket={
    getBasket:()=>requests.get('basket'),
    addToBasket:(productId:number,quantity:number=1)=>requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeFromBasket:(productId:number,quantity:number)=>requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const Errors={
    serverErr:()=>requests.get('WeatherForecast/server-error')
}

const Account={
    login:(values:any)=>requests.post('account/login',values),
    register:(values:any)=>requests.post('account/register',values),
    currentUser:()=>requests.get('account/currentUser'),
    fetchAddress:()=>requests.get('account/getAddress')
}

const Orders={
    list:()=>requests.get('orders'),
    fetch:(id:string)=>requests.get(`orders/${id}`),
    create:(obj:any)=>requests.post('orders',obj),
}

const Payments={
    createOrUpdatePaymentIntent:()=>requests.post('payments',{})
}

const agent={
    Catalog,
    Errors,
    Basket,
    Account,
    Orders,
    Payments
}

export default agent