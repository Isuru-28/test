import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function AddUser({ fetchData }) {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    petName: '',
    breed: '',
    gender: '',
    weight: '',
    dob: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setUserRole(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contact: '',
      petName: '',
      breed: '',
      gender: '',
      weight: '',
      dob: ''
    });
    setUserRole('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (userRole === 'Pet Owner') {
        response = await axios.post('http://localhost:3001/api/auth/register/admin/pet-owner', {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          contact: formData.contact,
          pet_name: formData.petName,
          breed: formData.breed,
          gender: formData.gender,
          weight: formData.weight,
          dob: formData.dob
        }, { withCredentials: true });
      } else {
        response = await axios.post('http://localhost:3001/api/auth/register/admin', {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          contact: formData.contact,
          role: userRole.toLowerCase(),
          weight: formData.weight,
          dob: formData.dob
        }, { withCredentials: true });
      }
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage('');
          handleClose();
          fetchData(); // Refresh the user list after adding a user
        }, 3000); // Adjust the delay as needed (in milliseconds)
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  const isEmailValid = (email) => {
    // Simple email validation regex
    return /^[^\s@]+@[^\s@]+\.[a-z]{3}$/.test(email);
  };

  const isContactValid = (contact) => {
    // Contact should be a positive number and not more than 10 digits
    return /^[0-9]{10}$/.test(contact) && parseInt(contact) > 0;
  };

  const isWeightValid = (weight) => {
    // Weight should be a positive integer
    return /^[1-9][0-9]*$/.test(weight);
  };

  const isFormValid = () => {
    const { firstName, lastName, petName, breed, email, contact, gender, weight } = formData;

    if (!firstName || !lastName || !email || !contact || !gender || !weight) return false;
    if (userRole === 'Pet Owner' && (!petName || !breed)) return false;

    if (userRole === 'Pet Owner') {
      return /^[a-zA-Z]+$/.test(firstName) &&
             /^[a-zA-Z]+$/.test(lastName) &&
             /^[a-zA-Z]+$/.test(petName) &&
             /^[a-zA-Z]+$/.test(breed) &&
             isEmailValid(email) &&
             isContactValid(contact) &&
             (gender === 'Male' || gender === 'Female') &&
             isWeightValid(weight);
    } else {
      return /^[a-zA-Z]+$/.test(firstName) &&
             /^[a-zA-Z]+$/.test(lastName) &&
             isEmailValid(email) &&
             isContactValid(contact) &&
             (gender === 'Male' || gender === 'Female') &&
             isWeightValid(weight);
    }
  };


  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add User
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-user-modal"
        aria-describedby="add-user-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Add User
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select value={userRole} onChange={handleChange}>
                <MenuItem value={'Pet Owner'}>Pet Owner</MenuItem>
                <MenuItem value={'Doctor'}>Doctor</MenuItem>
                <MenuItem value={'Receptionist'}>Receptionist</MenuItem>
              </Select>
            </FormControl>

            <Box mt={2}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
              {userRole === 'Pet Owner' && (
                <>
                  <TextField
                    fullWidth
                    label="Pet Name"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      name="gender"
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px', marginRight: '8px' }}
                disabled={!isFormValid()} // Disable button if form is not valid
              >
                Submit
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                style={{ marginTop: '16px' }}
              >
                Cancel
              </Button>
            </Box>
          </form>
          {successMessage && (
            <Typography variant="body1" style={{ color: 'green' }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" style={{ color: 'red' }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default AddUser;
