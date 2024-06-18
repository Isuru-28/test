import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel'; 

export default function RegisterForm() {
  const [gender, setGender] = React.useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255,189,137,0.6)',
        borderRadius: '20px',
        padding: 5,
        maxWidth: '90%',
        margin: 'auto',
      }}
    >
      <Typography variant="h5" component="div" sx={{ mb: 2 , fontWeight: 'bold' , textAlign: 'center'}}>
        Hi! Welcome to Pet Animal Clinic
      </Typography>
      <Grid container spacing={3} sx={{ marginBottom: 2, marginTop: 5 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="firstName"
            label="First Name"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="lastName"
            label="Last Name"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="contact"
            label="Contact"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="petName"
            label="Pet Name"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <TextField
            id="breed"
            label="Breed"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { color: 'black' } }}
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          />

          <FormControl 
            fullWidth 
            variant="outlined"
            sx={{ marginBottom: 2, maxWidth: '90%' }} // Adjust spacing and size
          >
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              label="Gender"
              sx={{
                color: 'black',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-icon': {
                    color: 'white',
                  },
                },
              }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center' }}>
        <Button
            variant="contained"
            sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '20px',
            marginBottom: 2,
            width: '15%', // Make the button longer
            }}
        >
            Register
        </Button>
        <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" variant="body2">
            Login
            </Link>
        </Typography>
      </Box>

    </Box>
  );
}
