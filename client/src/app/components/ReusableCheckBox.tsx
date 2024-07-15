import { Checkbox, FormControlLabel } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { useState } from "react";

interface Props{
    items:string[],
    onChange:(items:string[])=>void,
    checkedItems?:string[]
}

export default function ReusableCheckBox({items,onChange,checkedItems}:Props){
    const[localCheckedItems,setLocalCheckedItems]=useState(checkedItems||[]);
    function handleChange(value:string){
        const idx=localCheckedItems.findIndex(i=>i===value);
        let temp=[]
        if(idx===-1){
            temp=[...localCheckedItems,value]
            setLocalCheckedItems(temp)
        }
        else{
            temp=localCheckedItems.filter(x=>x!=value)
            setLocalCheckedItems(temp);
        }
        onChange(temp);
    }
    return(
        <FormGroup>
            {items.map(x=>
                <FormControlLabel checked={localCheckedItems.findIndex(z=>z==x)!==-1} 
                key={x} control={<Checkbox />} label={x} onChange={()=>handleChange(x)}/>
            )}
        </FormGroup>
    )
}