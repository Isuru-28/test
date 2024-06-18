import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '@mui/material';
import AddAppointment from './AddAppointment';
import CssBaseline from '@mui/material/CssBaseline';

const AppTable = () => {
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/appointments/user/${userId}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments.');
      setLoading(false);
    }
  };

  const handleAddAppointmentOpen = () => {
    setIsAddAppointmentOpen(true);
  };

  const handleAddAppointmentClose = () => {
    setIsAddAppointmentOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="lg">
    <div>
      <Button variant="contained" onClick={handleAddAppointmentOpen} style={{ marginTop: '5px' }}>Add Appointment</Button>

      {/* AddAppointment Modal */}
      <Modal
        open={isAddAppointmentOpen}
        onClose={handleAddAppointmentClose}
        aria-labelledby="add-appointment-modal-title"
        aria-describedby="add-appointment-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
          <AddAppointment onClose={handleAddAppointmentClose} />
        </div>
      </Modal>

      {/* Appointments Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'605px', scrollbarWidth: 'none'}}>
        <Table stickyHeader aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Pet Name</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ overflowY: 'scroll'}}>
            {appointments.map((appointment) => (
              <TableRow key={appointment.appid}>
                <TableCell>{appointment.appid}</TableCell>
                <TableCell>{appointment.pet_name}</TableCell>
                <TableCell>{appointment.first_name}</TableCell>
                <TableCell>{formatDate(appointment.appdate)}</TableCell>
                <TableCell>{formatTime(appointment.timeslot)}</TableCell>
                <TableCell>{appointment.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </Container>
    </React.Fragment>
  );
};

export default AppTable;
