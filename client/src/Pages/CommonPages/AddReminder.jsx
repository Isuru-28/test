import React, { useState } from 'react';
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  Container
} from '@mui/material';
import axios from 'axios';

const AddReminder = ({ petId, open, onClose, onAdd, userId }) => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    // Define the data object
    const data = {
      message: message,
      userId: userId,
      petId: petId // Assuming petId is accessible here
    };
  
    // Log the data object
    console.log(data);
  
    setErrorMessage('');
    try {
      await axios.post('http://localhost:3001/api/notifications', data);
      onAdd(); // Call the callback function to refresh notification data
      onClose(); // Close the modal
      setMessage(''); // Reset the message field after successful submission
      // Show a success message to the user
      alert('Reminder added successfully');
    } catch (error) {
      // Error handling code
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-reminder-modal"
      aria-describedby="add-reminder-form"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}

        <Typography variant="h5" gutterBottom>
          Add Reminder
        </Typography>

        <TextField
          margin="dense"
          name="message"
          label="Reminder Message"
          type="text"
          fullWidth
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddReminder;
