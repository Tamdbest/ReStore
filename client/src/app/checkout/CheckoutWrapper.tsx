import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "./CheckoutPage"
import { useAppDispatch } from "../store/configureStore"
import { useEffect, useState } from "react"
import agent from "../api/agent"
import { setBasket } from "../../features/basket/basketSlice"
import LoadingComponent from "../layouts/LoadingComponent"
const stripePromise=loadStripe('pk_test_51PWvpMCCBCy76ym5UFkfa8sJaYLAG2yV31wEJfU71KEwgFCl2vBnlPkh1I6vfC1PdTMUfsUejHxz0oApEpQlnKQ4007ddTqMz6')
export default function CheckoutWrapper(){
    const dispatch=useAppDispatch()
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        agent.Payments.createOrUpdatePaymentIntent()
            .then(response=>dispatch(setBasket(response)))
            .catch(err=>console.log(err))
            .finally(()=>setLoading(false))
    },[dispatch])
    if(loading)
        return <LoadingComponent message="Loading checkout..."/>
    return(
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    )
}