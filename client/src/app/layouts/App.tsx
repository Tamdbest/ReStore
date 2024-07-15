import { Container, CssBaseline, ThemeProvider, createTheme} from "@mui/material"
import Header from "./Header"
import { useCallback, useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from "./LoadingComponent"
import { useAppDispatch } from "../store/configureStore"
import { fetchBasketAsync} from "../../features/basket/basketSlice"
import { getCurrUser } from "../../features/account/accountslice"
import HomePage from "../../features/home/HomePage"

function App() {
  const dispatch=useAppDispatch()
  const location=useLocation();
  const[loading,setLoading]=useState(true)

  const appInit=useCallback(async ()=>{
    try{
      await dispatch(getCurrUser())
      setLoading(true)
      await dispatch(fetchBasketAsync())
    }
    catch(err){
      console.log(err)
    }
  },[dispatch])

  useEffect(()=>{
    appInit().then(()=>setLoading(false))
  },[appInit])

  const [darkMode,setDarkMode]=useState(false)
  const paletteType=darkMode?'dark':'light'
  const  theme=createTheme({
      palette:{
        mode:paletteType,
        background:{
          default:paletteType==='light'?'#eaeaea':'#121212'
        }
      }
    })
  function changeMode(){
    setDarkMode(!darkMode)
  }
  
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer hideProgressBar position='bottom-right' theme='colored'/>
      <CssBaseline/>
      <Header darkMode={darkMode} changeMode={changeMode}/>{
        loading?<LoadingComponent message="Initialising app..."/>:
          (location.pathname==='/'?<HomePage/>:
      (<Container sx={{ mt: 4 }}>
        <Outlet/>
      </Container>))
      }
    </ThemeProvider>
  )
}

export default App
