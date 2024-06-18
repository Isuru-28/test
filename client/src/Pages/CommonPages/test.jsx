import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';
  const userRole = user.role || '';

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user/profile/${userId}/${userRole}`);
            setUserData(response.data);
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

  // Ensure month and day are formatted with leading zeros if necessary
  if (month < 10) {
      month = `0${month}`;
  }
  if (day < 10) {
      day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};

  return (
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
              variant="outlined"
              value={userData.email}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              value={userData.firstName}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              value={userData.lastName}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact"
              variant="outlined"
              value={userData.contact}
              disabled
            />
          </Grid>
          {userRole === 'pet_owner' && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Pet Name"
                  variant="outlined"
                  value={userData.pet_name}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Breed"
                  variant="outlined"
                  value={userData.breed}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  variant="outlined"
                  value={userData.gender}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  variant="outlined"
                  value={userData.weight}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  variant="outlined"
                  value={formatDate(userData.dob)}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage;
