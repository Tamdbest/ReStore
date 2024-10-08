import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

interface Props{
    darkMode:boolean
    changeMode:()=>void
}

const midLinks=[{title:'catalog',path:'/catalog'},{title:'about',path:'/about'},
    {title:'contact',path:'/contact'},
]
const rightLinks=[{title:'login',path:'/login'},{title:'register',path:'/register'}
]
const navLinkStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}
export default function Header({darkMode,changeMode}:Props){
    const {basket}=useAppSelector(state=>state.basket)
    const {user}=useAppSelector(state=>state.account)
    const basketCount=basket?.items.reduce((count,item)=>count+item.quantity,0)
    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography
                        variant='h6'
                        component={NavLink}
                        to='/'
                        sx={navLinkStyles}
                    >
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={changeMode} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navLinkStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size='large' edge='start' color='inherit' sx={{ mr: 2 }}>
                        <Badge badgeContent={basketCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user!==null?<SignedInMenu/>:(
                        <List sx={{ display: 'flex' }}>
                        {rightLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navLinkStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    )
}