import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavBar from '../Components/TopNavBar/LoginNavBar';
import image from '../Assets/loginBG.jpg';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

function LoginLayout() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      const { userId, role } = response;
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'receptionist':
          navigate('/receptionist');
          break;
        case 'pet_owner':
          navigate('/pet-owner');
          break;
        default:
          setError('Invalid role');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '99vw',
        height: '95vh',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', paddingTop: 1 }}>
        <NavBar />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '95%',
          height: '100%',
        }}
      >
        <Box sx={{ display: 'flex', padding: '40px', boxSizing: 'border-box', width: '100%' }}>
          <Grid container spacing={0} sx={{ flexGrow: 1 }}>
            <Grid item xs={6}>
              <Paper
                sx={{
                  height: '97%',
                  padding: 1,
                  textAlign: 'center',
                  color: 'text.secondary',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
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
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: 3,
                  }}
                  onSubmit={handleLogin}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                  <Link href="/forget-password" variant="body2" sx={{ mt: 1 }}>
                    Forget password?
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: 'black', color: 'white', width: '40%', borderRadius: '20px' }}
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
            <Grid item xs={6}>
              <Paper
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  color: 'text.secondary',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: '16px',
                  borderBottomRightRadius: '16px',
                  overflow: 'hidden',
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
    </Box>
  );
}

export default LoginLayout;
