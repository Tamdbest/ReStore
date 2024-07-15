import { FormControlLabel, Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";

interface Props{
    defVal:string,
    options:any[],
    onChange:(event:any)=>void
}

export default function RadioButtonGroup({defVal,options,onChange}:Props){
    return (
        <RadioGroup defaultValue={defVal}>
            {options.map(x=>
                <FormControlLabel key={x.value} value={x.value}
                control={<Radio />} label={x.label} onChange={onChange}/>
            )}
        </RadioGroup>
    )
}