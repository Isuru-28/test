import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Grid, Box, Checkbox, FormControlLabel } from '@mui/material';

const ChangeStatus = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';
  const userRole = user.role || '';

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slot.start)
        ? prevSelected.filter((s) => s !== slot.start)
        : [...prevSelected, slot.start]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedSlots(selectAll ? [] : availableSlots.map((slot) => slot.start));
  };

  const handleMarkUnavailable = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot.');
      return;
    }

    const changeStatusData = selectedSlots.map((slot) => ({
      appdate: selectedDate,
      timeslot: slot,
      createdby: userRole,
      user_id: userId,
      state: 'unavailable',
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/appointments/mark-unavailable', { slots: changeStatusData });
      if (response.status === 200) {
        alert('Time slots marked as unavailable successfully!');
        fetchAvailableSlots(selectedDate);
        setSelectedSlots([]);
        setSelectAll(false);
      } else {
        console.error('Error response:', response);
        alert('Failed to mark time slots as unavailable. Please try again.');
      }
    } catch (error) {
      console.error('Error marking unavailable:', error.response || error);
      alert('Failed to mark time slots as unavailable. Please try again.');
    }
  };

  const handleMarkAvailable = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot.');
      return;
    }
    
    const changeStatusData = selectedSlots.map((slot) => ({
      appdate: selectedDate,
      timeslot: slot,
      createdby: userRole,
      user_id: userId,
      state: 'available',
    }));
  
    try {
      const config = {
        data: { slots: changeStatusData }, // Include data in the request body
      };
  
      const response = await axios.delete('http://localhost:3001/api/appointments/mark-available', config);
      if (response.status === 200) {
        alert('Time slots marked as available successfully!');
        fetchAvailableSlots(selectedDate);
        setSelectedSlots([]);
        setSelectAll(false);
      } else {
        console.error('Error response:', response);
        alert('Failed to mark time slots as available. Please try again.');
      }
    } catch (error) {
      console.error('Error marking available:', error.response || error);
      alert('Failed to mark time slots as available. Please try again.');
    }
  };
  
  

  const generateNextFiveDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
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

      {/* Show buttons only when a date is selected */}
      {selectedDate && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Available Time Slots on {selectedDate}</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectAll} onChange={handleSelectAll} />}
              label="Select All"
            />
            <Grid container spacing={1}>
              {availableSlots.map((slot) => (
                <Grid item key={slot.start}>
                  <Button
                    variant="contained"
                    onClick={() => handleSlotClick(slot)}
                    sx={{
                      backgroundColor: selectedSlots.includes(slot.start) ? 'purple' : 'green',
                      margin: '5px',
                      '&:hover': {
                        backgroundColor: selectedSlots.includes(slot.start) ? 'darkblue' : 'darkgreen',
                      },
                    }}
                  >
                    {slot.start} - {slot.end} ({slot.state})
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={2} >
            <Grid item>
              <Button variant="contained" onClick={handleMarkUnavailable} sx={{ margin: '5px' }}>Mark Unavailable</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleMarkAvailable} sx={{ margin: '5px' }}>Mark Available</Button>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  </Box>
  );
};

export default ChangeStatus;
