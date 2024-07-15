import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../api/agent";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { removeBasket } from "../../features/basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ['Shipping address', 'Review your order', 'Payment details'];


export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [cardState,setCardState]=useState<{cardKey?:{[key in StripeElementType]?:string}}>({});
    const [cardComplete,setCardComplete]=useState<any>({cardNumber:false,cardExpiry:false,cardCvc:false});
    const [paymentMessage,setPaymentMessage]=useState("");
    const [paymentSucceeded,setPaymentSucceeded]=useState(false);
    const {basket}=useAppSelector(state=>state.basket)
    const stripe=useStripe()
    const elements=useElements()
    function handleFieldChange(event:any){
        setCardState({...cardState,cardKey:{...cardState.cardKey,[event.elementType]:event.error?.message}})
        setCardComplete({...cardComplete,[event.elementType]:event.complete})
        console.log(cardComplete.cardNumber)
    }
    const dispatch=useAppDispatch()
    const[loading,setLoading]=useState(false);
    const[orderNum,setOrderNum]=useState(0);
    const validationSchem=validationSchema
    const methods=useForm({
        mode:"onTouched",
        resolver:yupResolver(validationSchem[activeStep])
    });
    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentForm cardState={cardState} handleFieldChange={handleFieldChange}/>;
            default:
                throw new Error('Unknown step');
        }
    }
    useEffect(()=>{
        agent.Account.fetchAddress()
            .then(address=>{
                if(address){
                    methods.reset({...methods.getValues,...address,saveAddress:false})
                }
            })
            .catch(err=>{
                console.log(err)
            })
    },[methods])

    async function submitOrder(data:FieldValues){
        setLoading(true);
        const {nameOnCard,saveAddress,...shippingAddress}=data;
        if(!stripe||!elements)
            return;
        try{
            const cardElements=elements.getElement(CardNumberElement)
            const paymentResult=await stripe.confirmCardPayment(basket!.clientSecret!,{
                payment_method:{
                    card:cardElements!,
                    billing_details:{
                        name:nameOnCard
                    }
                }
            })
            if(paymentResult.paymentIntent?.status==="succeeded"){
                const orderNumber=await agent.Orders.create({saveAddress,shippingAddress});
                setOrderNum(orderNumber)
                dispatch(removeBasket())
                setActiveStep(activeStep+1);
                setLoading(false);
                setPaymentMessage("Thank you for purchasing from our site, your order has been placed successfully!")
                setPaymentSucceeded(true)
            }
            else{
                setActiveStep(activeStep+1);
                setLoading(false);
                setPaymentMessage(paymentResult.error!.message!)
                setPaymentSucceeded(false)
            }
            setLoading(false)
        }
        catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    const handleNext = async (data:FieldValues) => {
        if(activeStep==steps.length-1){
            await submitOrder(data)
        }
        else{
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = async () => {
        setActiveStep(activeStep - 1);
    };

    function buttonStatus():boolean{
        if(activeStep===steps.length-1){
            return !cardComplete.cardNumber||!cardComplete.cardExpiry||!cardComplete.cardCvc
        }
        else{
            return !methods.formState.isValid
        }
    }

    return (
        <FormProvider {...methods}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            {paymentMessage}
                        </Typography>
                        {paymentSucceeded?(
                            <Typography variant="subtitle1">
                                Your order number is {orderNum}. We have emailed your order
                                confirmation, and will send you an update when your order has
                                shipped.
                        </Typography>
                        ):(<Button variant="contained" onClick={handleBack}>Go back and try again!</Button>)}
                    </>
                ) : (
                    <form onSubmit={methods.handleSubmit(handleNext)}>
                        {getStepContent(activeStep)}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                    Back
                                </Button>
                            )}
                            <LoadingButton
                                loading={loading}
                                disabled={buttonStatus()}
                                variant="contained"
                                type='submit'
                                sx={{mt: 3, ml: 1}}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </LoadingButton>
                        </Box>
                    </form>
                )}
            </>
        </Paper>
        </FormProvider>
    );
}
