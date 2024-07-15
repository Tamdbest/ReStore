import { Typography, Grid, Checkbox, FormControlLabel} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import React from "react";

const Checkboxes = ({ options, control, name, formState}:any) => {
  const { field } = useController({
    control,
    name,
    defaultValue:false
  });
  const [value, setValue] = React.useState(field.value || false);

  return (
    <>
      {options.map((option:any) => (
        <FormControlLabel key={option} control={
        <Checkbox
          onChange={(e) => {
            let valueCopy = value;

            // update checkbox value
            valueCopy = e.target.checked ? true : false;

            // send data to react hook form
            field.onChange(valueCopy);

            // update local state
            setValue(valueCopy);
          }}
          key={option}
          disabled={!formState.isDirty}
          checked={value}
          value={value}
          name={name}
        />} label={option}/>
      ))}
    </>
  );
};

export default function AddressForm() {
  const{formState,control}=useFormContext()
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} label='Full name' name='fullName'/>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} label='Address 1' name='address1'/>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} label='Address 2' name='address2'/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label='City' name='city'/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label='State' name='state'/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label='Zip' name='zip'/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label='Country' name='country'/>
        </Grid>
        <Grid item xs={12}>
        {/* <AppCheckBox 
                    disabled={!formState.isDirty}
                    name='saveAddress' 
                    label='Save this as default address' 
                    control={control} 
                /> */}
          <Checkboxes
          options={["Save address as default address?"]}
          control={control}
          name="saveAddress"
          formState={formState}
        />
        </Grid>
      </Grid>
    </>
  );
}
