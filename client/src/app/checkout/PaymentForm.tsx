import { Typography, Grid, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import { StripeInput } from "./StripeInput";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";

interface Props{
  cardState:{cardKey?:{[key in StripeElementType]?:string}}
  handleFieldChange:(event:any)=>void
}

export default function PaymentForm({cardState,handleFieldChange}:Props) {
  const{control}=useFormContext()
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextInput control={control} label='Name on card' name='nameOnCard'/>
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField
            onChange={handleFieldChange}
            error={!!cardState.cardKey?.cardNumber}
            helperText={cardState.cardKey?.cardNumber}
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            InputLabelProps={{shrink:true}}
            InputProps={{inputComponent:StripeInput,inputProps:{component:CardNumberElement}}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField
            onChange={handleFieldChange}
            error={!!cardState.cardKey?.cardExpiry}
            helperText={cardState.cardKey?.cardExpiry}
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            InputLabelProps={{shrink:true}}
            InputProps={{inputComponent:StripeInput,inputProps:{component:CardExpiryElement}}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField
            onChange={handleFieldChange}
            error={!!cardState.cardKey?.cardCvc}
            helperText={cardState.cardKey?.cardCvc}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            InputLabelProps={{shrink:true}}
            InputProps={{inputComponent:StripeInput,inputProps:{component:CardCvcElement}}}
          />

        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </>
  );
}