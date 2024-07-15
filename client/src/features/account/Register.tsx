import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate} from 'react-router-dom';
import { Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Register() {

  
  const {register,handleSubmit,formState:{errors,isSubmitting,isValid}}=useForm({mode:'onTouched'});

  const navigate=useNavigate();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component={Paper} maxWidth="sm"
      sx={{display:'flex', flexDirection:'column', alignItems:'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
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
              id="email"
              label="Email"
              {...register('Email',{required:'Please enter your email to proceed!',
                pattern:{
                  value:/^.+@[^.].*\.[a-z]{2,}$/,
                  message:'Invalid email!'
                }
              })}
              error={!!errors?.Email}
              helperText={errors?.Email?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('Password',{required:'Please enter your password to proceed!',
                pattern:{
                  value:/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                  message:'Please enter a stronger password!'
                }
              })}
              error={!!errors?.Password}
              helperText={errors?.Password?.message as string}
            />
            <LoadingButton
              loading={isSubmitting}
              disabled={!isValid}
              fullWidth
              variant="contained"
              onClick={handleSubmit(data=>{agent.Account.register(data).then(()=>{
                toast.success('You have been registered successfully, please login to continue')
                navigate('/login')
              })
                .catch((err)=>console.log(err))})}
              sx={{ mt: 3, mb: 2 }}
            >
              Register
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