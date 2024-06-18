import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import AddAppointment from './AddAppointment'; // Assuming AddAppointment is in the same directory
import ChangeStatus from './ChangeStatus'; // Importing the ChangeStatus component
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for routing
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

const AppTable2 = () => {
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false); // State to control the ChangeStatus modal
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role || '';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/appointments/all');
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments.');
      setLoading(false);
    }
  };

  const handleAccept = async (appid) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const userId = user.userId || '';
  
      // Send PUT request with user_id in the request body
      await axios.put(`http://localhost:3001/api/appointments/accept/${appid}`, {
        user_id: userId,
      });
  
      // Refresh the appointments list after successful request
      fetchAppointments(); 
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };
  
  
  const handleComplete = async (appid) => {
    try {
      await axios.put(`http://localhost:3001/api/appointments/complete/${appid}`);
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };  

  const handleAddAppointmentOpen = () => {
    setIsAddAppointmentOpen(true);
  };

  const handleAddAppointmentClose = () => {
    setIsAddAppointmentOpen(false);
  };

  const handleStatusChangeOpen = () => {
    setIsChangeStatusOpen(true);
  };

  const handleStatusChangeClose = () => {
    setIsChangeStatusOpen(false);
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
      {/* <Button variant="contained" onClick={handleAddAppointmentOpen}>Add Appointment</Button>
      <Button variant="contained" onClick={handleStatusChangeOpen}>Change Status</Button> */}

      {(userRole === 'admin' || userRole === 'receptionist') && (
        <div style={{ paddingTop:'5px' }}>
          <Button variant="contained" onClick={handleAddAppointmentOpen} style={{ marginTop: '5px', marginLeft: '10px' }}>Add Appointment</Button>
          <Button variant="contained" onClick={handleStatusChangeOpen} style={{ marginTop: '5px', marginLeft: '10px' }}>Change Status</Button>
        </div>
      )}

      <div>
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

      {/* ChangeStatus Modal */}
      <Modal
        open={isChangeStatusOpen}
        onClose={handleStatusChangeClose}
        aria-labelledby="change-status-modal-title"
        aria-describedby="change-status-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
          <ChangeStatus onClose={handleStatusChangeClose} />
        </div>
      </Modal>
      </div>

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
              {(userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor') && (
                <TableCell>Actions</TableCell>
              )}
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
                {(userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor') && (
                  <TableCell>
                  {appointment.state === 'pending' ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(appointment.appid)}
                      >
                        Accept
                      </Button>
                    </>
                  ) : (
                    appointment.state === 'booked' && (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleComplete(appointment.appid)}
                        >
                          Complete
                        </Button>
                      </>
                    )
                  )}
                </TableCell>
                )}
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

export default AppTable2;
