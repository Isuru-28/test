import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Grid, Paper, Box } from '@mui/material';
import { Alert } from '@mui/material';

const EditTimeSlotsModal = () => {
  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';
  const userRole = user.role || '';

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/appointments/available/${date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot.start);
  };

  const handleMakeUnavailable = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot to make unavailable.');
      return;
    }

    try {
      await axios.put('http://localhost:3001/api/appointments/unavailable', {
        date: selectedDate,
        timeslot: selectedSlot
      });
      alert('Time slot made unavailable successfully!');
      fetchAvailableSlots(selectedDate); // Refresh the slots after making it unavailable
    } catch (error) {
      console.error('Error making time slot unavailable:', error);
      alert('Failed to make time slot unavailable. Please try again.');
    }
  };

  const generateNextFiveDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i < 6; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <Box p={2} elevation={3} maxWidth="600px">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select a date</InputLabel>
            <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
              <MenuItem value="" disabled>Select a date</MenuItem>
              {generateNextFiveDays().map((date) => (
                <MenuItem key={date} value={date}>{date}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedDate && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Available Time Slots on {selectedDate}</Typography>
            <Grid container spacing={1}>
              {availableSlots.map((slot) => (
                <Grid item key={slot.start}>
                  <Button
                    variant="contained"
                    onClick={() => handleSlotClick(slot)}
                    disabled={slot.state !== 'available'}
                    sx={{
                      backgroundColor: selectedSlot === slot.start ? 'purple' : (slot.state === 'booked' ? 'red' : 'green'),
                      margin: '5px',
                      '&:hover': {
                        backgroundColor: selectedSlot === slot.start ? 'darkblue' : (slot.state === 'booked' ? 'darkred' : 'darkgreen'),
                      }
                    }}
                  >
                    {slot.start} - {slot.end} ({slot.state})
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              onClick={handleMakeUnavailable}
              disabled={!selectedSlot}
              sx={{
                marginTop: '20px',
                backgroundColor: 'blue',
                '&:hover': {
                  backgroundColor: 'darkblue',
                }
              }}
            >
              Make Unavailable
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EditTimeSlotsModal;
