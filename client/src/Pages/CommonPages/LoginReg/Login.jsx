import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import image from '../../../Assets/loginBG.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
// import LoginForm from './LoginForm';

export default function Login() {
  return (
    <Box sx={{display:'flex' , padding: '40px', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, height: '100%' }}>
        <Grid container spacing={0} sx={{ flexGrow: 1, height: '100%' }}>
          <Grid item xs={6}>
            <Paper
              sx={{

                height: '100%',
                padding: 1,
                textAlign: 'center',
                color: 'text.secondary',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '0px',
                borderTopLeftRadius: '16px',
                borderBottomLeftRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,189,137,0.2)',
              }}
            >


                    <Box
                        component="form"
                        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: 3}}
                      >
                        <Typography variant="h5" component="div" sx={{ mb: 2, color: 'black' }}>
                          Hi! Welcome to Pet Animal Clinic
                        </Typography>
                        <TextField
                          required
                          id="email"
                          label="Email"
                          type="email"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          autoFocus
                          sx={{ maxWidth: '70%' }}
                        />
                        <TextField
                          required
                          id="password"
                          label="Password"
                          type="password"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          sx={{ maxWidth: '70%' }}
                        />
                        <Link href="/forget-password" variant="body2" sx={{ alignSelf: 'flex', mt: 1 }}>
                          Forget password?
                        </Link>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{mt: 2, backgroundColor: 'black', color: 'white', width: '40%', borderRadius: '20px'}}
                        >
                          Login
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Don't have an account?{' '}
                          <Link href="/register" variant="body2">
                            Sign up
                          </Link>
                        </Typography>
                    </Box>


              
            </Paper>
          </Grid>


          {/* Image Grid */}
          <Grid item xs={6}>
            <Paper
              sx={{
                height: '100%',
                padding: 0,
                textAlign: 'center',
                color: 'text.secondary',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px',
                overflow: 'hidden', // Ensure content stays within the bounds
                display: 'flex',
              }}
            >
              <Box
                component="img"
                src={image}
                alt="Description"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderTopRightRadius: '16px',
                  borderBottomRightRadius: '16px',
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
