// import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
// import axios from 'axios';

export default function LoginForm() {


  return (
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
  );
}
