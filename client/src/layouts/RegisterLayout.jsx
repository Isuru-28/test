import React, { useState } from 'react';
import Box from '@mui/material/Box';
import NavBar from '../Components/TopNavBar/LoginNavBar';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterLayout() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    contact: '',
    pet_name: '',
    breed: '',
    gender: '',
    weight: '',
    dob: ''
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'email':
        error = isEmailValid(value) ? '' : 'Invalid email address';
        break;
      case 'contact':
        error = isContactValid(value) ? '' : 'Invalid contact number';
        break;
      case 'weight':
        error = isWeightValid(value) ? '' : 'Invalid weight';
        break;
      case 'first_name':
        error = isNameValid(value) ? '' : 'Invalid first name';
        break;
      case 'last_name':
        error = isNameValid(value) ? '' : 'Invalid last name';
        break;
      case 'pet_name':
        error = isNameValid(value) ? '' : 'Invalid pet name';
        break;
      case 'breed':
        error = isNameValid(value) ? '' : 'Invalid breed';
        break;
      case 'confirmPassword':
        error = value === formData.password ? '' : 'Passwords do not match';
        break;
      default:
        error = value.trim() ? '' : 'This field is required';
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    const fieldError = validateField(id, value);
    setErrors({ ...errors, [id]: fieldError });
  };

  const handleGenderChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, gender: value });
    setErrors({ ...errors, gender: value ? '' : 'This field is required' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register/pet-owner', formData); // Update URL to backend port
      if (response.status === 201) {
        navigate('/login'); // Redirect to login page on successful registration
      }
    } catch (error) {
      setErrors({ general: error.response.data.message });
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) errors[key] = error;
    });
    return errors;
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[a-z]{3}$/.test(email);

  const isContactValid = (contact) => /^[0-9]{10}$/.test(contact) && parseInt(contact) > 0;

  const isWeightValid = (weight) => /^[1-9][0-9]*$/.test(weight);

  const isNameValid = (name) => /^[A-Za-z\s]+$/.test(name);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '98vw', height: '97vh', overflow: 'hidden', padding: 0 }}
    >
      <Box sx={{ width: '100%', height: '10%', maxHeight: '80px', paddingTop: 1, paddingBottom: 1 }}>
        <NavBar />
      </Box>
      <Box
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255,189,137,0.6)',
            borderRadius: '20px',
            padding: 2,
            maxWidth: '90%',
            margin: 'auto',
          }}
        >
          <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Hi! Welcome to Pet Animal Clinic
          </Typography>
          {errors.general && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errors.general}
            </Typography>
          )}
          <Grid container spacing={3} sx={{ marginBottom: 2, marginTop: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="first_name"
                label="First Name"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
              />

              <TextField
                id="last_name"
                label="Last Name"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />

              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />

              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />

              <TextField
                id="contact"
                label="Contact"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="pet_name"
                label="Pet Name"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.pet_name}
                onChange={handleChange}
                error={!!errors.pet_name}
                helperText={errors.pet_name}
                required
              />

              <TextField
                id="breed"
                label="Breed"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.breed}
                onChange={handleChange}
                error={!!errors.breed}
                helperText={errors.breed}
                required
              />

              <FormControl 
                fullWidth 
                variant="outlined"
                sx={{ marginBottom: 2, maxWidth: '90%' }}
              >
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={formData.gender}
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
                  error={!!errors.gender}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="body2" color="error">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>

              <TextField
                id="weight"
                label="Weight"
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.weight}
                onChange={handleChange}
                error={!!errors.weight}
                helperText={errors.weight}
                required
              />

              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: { color: 'black' } }}
                sx={{ marginBottom: 2, maxWidth: '90%' }}
                value={formData.dob}
                onChange={handleChange}
                error={!!errors.dob}
                helperText={errors.dob}
                required
              />
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
                width: '15%',
              }}
              onClick={handleSubmit}
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
      </Box>
    </Box>
  );
}

export default RegisterLayout;
