import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, Button, Box, Alert } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    contact: '',
    pet_name: '',
    breed: '',
    gender: '',
    weight: '',
    dob: '',
    password: '', // Renamed from newPassword
    confirmPassword: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';
  const userRole = user.role || '';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/profile/${userId}/${userRole}`);
        setUserData(response.data);
        setOriginalData(response.data); // Save the original data for cancellation
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId, userRole]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Validate input
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[a-z]{3}$/.test(value) ? '' : 'Invalid email address';
        break;
      case 'first_name':
      case 'last_name':
      case 'pet_name':
      case 'breed':
        error = /^[A-Za-z\s]+$/.test(value) ? '' : 'Alphabetic characters only';
        break;
      case 'contact':
        error = /^[0-9]{10}$/.test(value) ? '' : 'Contact must be 10 digits';
        break;
      case 'gender':
        error = /^(male|female)$/i.test(value) ? '' : 'Invalid gender';
        break;
      case 'weight':
        error = /^[1-9][0-9]*$/.test(value) ? '' : 'Weight must be a positive integer';
        break;
      case 'dob':
        error = value ? '' : 'Date of birth is required';
        break;
      case 'confirmPassword':
        if (userData.password && userData.confirmPassword) {
          if (userData.password !== value) {
            error = 'Passwords do not match';
          }
        }
        break;
      default:
        break;
    }

    setErrors({ ...errors, [fieldName]: error });
  };

  const handleEditClick = () => {
    setEditMode(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCancelClick = () => {
    setUserData(originalData);
    setEditMode(false);
    setErrors({});
  };

  const handleUpdateClick = async () => {
    // Create a copy of userData excluding password fields if they are empty
    const updatedData = { ...userData };
    delete updatedData.confirmPassword; // Remove confirmPassword field

    try {
      const formattedData = { ...updatedData, dob: formatDate(userData.dob) };
      await axios.put(`http://localhost:3001/api/user/profile/${userId}/${userRole}`, formattedData);
      setSuccessMessage('Profile updated successfully');
      setEditMode(false);

      // Delayed refresh after successful update
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile');
    }
  };

  const isUpdateDisabled = Object.values(errors).some(error => error) ||
    Object.values(userData).some(value => value === '') ||
    (userData.password && userData.confirmPassword && userData.password !== userData.confirmPassword);

  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              value={userData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              variant="outlined"
              value={userData.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              variant="outlined"
              value={userData.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              variant="outlined"
              value={userData.contact}
              onChange={handleInputChange}
              error={!!errors.contact}
              helperText={errors.contact}
              disabled={!editMode}
            />
          </Grid>
          {userRole === 'pet_owner' && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Pet Name"
                  name="pet_name"
                  variant="outlined"
                  value={userData.pet_name}
                  onChange={handleInputChange}
                  error={!!errors.pet_name}
                  helperText={errors.pet_name}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Breed"
                  name="breed"
                  variant="outlined"
                  value={userData.breed}
                  onChange={handleInputChange}
                  error={!!errors.breed}
                  helperText={errors.breed}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  name="gender"
                  variant="outlined"
                  value={userData.gender}
                  onChange={handleInputChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  variant="outlined"
                  value={userData.weight}
                  onChange={handleInputChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  variant="outlined"
                  value={userData.dob ? formatDate(userData.dob) : ''}
                  onChange={handleInputChange}
                  error={!!errors.dob}
                  helperText={errors.dob}
                  InputLabelProps={{ shrink: true }}
                  disabled={!editMode}
                />
              </Grid>
            </>
          )}
          {editMode && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  value={userData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box mt={2}>
          {!editMode ? (
            <Button variant="contained" color="primary" onClick={handleEditClick}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateClick}
                disabled={isUpdateDisabled}
                sx={{ mr: 2 }}
              >
                Update Profile
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
            </>
          )}
        </Box>
        {errorMessage && (
          <Box mt={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
        {successMessage && (
          <Box mt={2}>
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}
      </Box>
      </Container>
    </React.Fragment>
  );
};

export default ProfilePage;
