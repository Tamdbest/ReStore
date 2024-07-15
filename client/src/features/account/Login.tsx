import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signIn } from './accountslice';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {

  const navigate=useNavigate()
  const dispatch=useAppDispatch()
  const location=useLocation()
  
  const {register,handleSubmit,formState:{errors,isSubmitting,isValid}}=useForm({mode:'onTouched'});

  async function submitForm(data:FieldValues){
    await dispatch(signIn(data))
    navigate(location.state?.from||'/catalog')
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component={Paper} maxWidth="sm"
      sx={{display:'flex', flexDirection:'column', alignItems:'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              autoFocus
              {...register('Username',{required:'Please enter your username to proceed!'})}
              error={!!errors?.Username}
              helperText={errors?.Username?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('Password',{required:'Please enter your password to proceed!'})}
              error={!!errors?.Password}
              helperText={errors?.Password?.message as string}
            />
            <LoadingButton
              loading={isSubmitting}
              disabled={!isValid}
              fullWidth
              variant="contained"
              onClick={handleSubmit(submitForm)}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to='/register'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
    </ThemeProvider>
  );
}