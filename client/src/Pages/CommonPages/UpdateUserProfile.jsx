import React, { useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button } from '@mui/material';

const UpdateUserProfile = ({ userData, setUserData, setEditMode }) => {
    const [updatedData, setUpdatedData] = useState({
        email: userData.email,
        password: '',
        first_name: userData.first_name,
        last_name: userData.last_name,
        contact: userData.contact
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:3001/api/user/profile/${userData.id}/${userData.role}`, updatedData);
            setUserData(updatedData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={updatedData.email}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={updatedData.password}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={updatedData.first_name}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={updatedData.last_name}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Contact"
                    name="contact"
                    value={updatedData.contact}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Grid>
        </Grid>
    );
};

export default UpdateUserProfile;
