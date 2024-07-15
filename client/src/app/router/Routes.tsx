import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layouts/App";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import HomePage from "../../features/home/HomePage";
import ServerError from "../api/errors/ServerError";
import NotFound from "../api/errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import Garbage from "../garbage/Garbage";
import CheckoutWrapper from "../checkout/CheckoutWrapper";

export const routes=createBrowserRouter([
    {
    path:'/',
    element:<App/>,
    children:[
        {path:'',element:<HomePage/>},
        {path:'about',element:<AboutPage/>},
        {path:'contact',element:<ContactPage/>},
        {path:'catalog',element:<Catalog/>},
        {path:'catalog/:id',element:<ProductDetails/>},
        {path:'server-error',element:<ServerError/>},
        {path:'notfound',element:<NotFound/>},
        {path:'basket',element:<BasketPage/>},
        {path:'login',element:<Login/>},
        {path:'register',element:<Register/>},
        {path:'garbage',element:<Garbage/>},
        {path:'*',element:<Navigate replace to='/notfound'/>},
        {element:<RequireAuth/>,
            children:[{path:'checkout',element:<CheckoutWrapper/>},{path:'orders',element:<Orders/>}]   
        }
    ]}
])