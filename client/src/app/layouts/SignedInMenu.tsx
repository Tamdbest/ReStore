import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { logout } from "../../features/account/accountslice";
import { removeBasket } from "../../features/basket/basketSlice";
import { Link } from "react-router-dom";

export default function SignedInMenu(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch=useAppDispatch()
    const {user}=useAppSelector(state=>state.account)
    const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
        <Button color='inherit' onClick={handleClick} sx={{typography:'h6'}}>
            {user?.email}
        </Button>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem component={Link} to='/orders'>Orders</MenuItem>
            <MenuItem onClick={()=>{
                    dispatch(logout())
                    dispatch(removeBasket())
                }}>Logout</MenuItem>
        </Menu>
        </div>
    );
}