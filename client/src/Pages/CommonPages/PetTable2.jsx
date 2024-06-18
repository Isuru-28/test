import React, { useState, useEffect, useCallback  } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CssBaseline, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import AddPrescription from './AddPrescription';
import AddReminder from './AddReminder';
import VaccinationReport from './VaccinationReport';

const PetTable2 = () => {
  const { petId } = useParams(); // Get petId from URL
  const [pet, setPet] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addPrescriptionOpen, setAddPrescriptionOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [showReport, setShowReport] = useState(false); 

  const [editPetData, setEditPetData] = useState({
    pet_name: '',
    breed: '',
    weight: '',
    dob: ''
  });

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';
  const userRole = user.role || '';

  const fetchPetDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pets/${petId}`);
      setPet(response.data);
      setEditPetData({
        petName: response.data.pet_name,
        breed: response.data.breed,
        weight: response.data.weight,
        dob: response.data.dob
      });
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  }, [petId]);

  const fetchPrescriptions = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/prescriptions/${petId}`);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  }, [petId]);

  useEffect(() => {
    fetchPetDetails();
    fetchPrescriptions();
  }, [fetchPetDetails, fetchPrescriptions]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    let newErrors = { ...errors };

    // Validation for pet name and breed (alphabetic characters only)
    if (name === 'pet_name' || name === 'breed') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        newErrors[name] = 'Only alphabetic characters are allowed';
      } else {
        delete newErrors[name];
      }
    }

    // Validation for weight (numeric, no float points, greater than 0 and less than 100)
    if (name === 'weight') {
      const weightValue = Number(value);
      if (!Number.isInteger(weightValue) || weightValue <= 0 || weightValue >= 100) {
        newErrors[name] = 'Weight should be a numeric number greater than 0 and less than 100';
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);

    setEditPetData({ ...editPetData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3001/api/pets/${petId}`, editPetData);
      setPet(editPetData);
      setEditDialogOpen(false);
      fetchPetDetails(); // Re-fetch the pet details after saving changes
    } catch (error) {
      console.error('Error updating pet details:', error);
    }
  };

  const handleAddPrescriptionOpen = () => {
    setAddPrescriptionOpen(true);
  };

  const handleAddPrescriptionClose = () => {
    setAddPrescriptionOpen(false);
  };

  const handleDeletePrescription = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/prescriptions/${prescriptionToDelete}`);
      setDeleteDialogOpen(false);
      fetchPrescriptions(); // Re-fetch the prescriptions after deletion
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };


  const handleNotificationClick = () => {
    setNotificationDialogOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationDialogOpen(false);
  };

  const handleNotificationAdd = () => {
    fetchPrescriptions();
  }; 

  const handlePrintClick = () => {
    setShowReport(true);
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0;
  };  

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: 'left' }}>
            {pet && (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography style={{ minWidth: '80px' }}>Name :</Typography>
                  <Typography style={{ paddingLeft: '20px' }}>{pet.pet_name}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography style={{ minWidth: '80px' }}>Breed :</Typography>
                  <Typography style={{ paddingLeft: '20px' }}>{pet.breed}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography style={{ minWidth: '50px' }}>Weight (Kg) :</Typography>
                  <Typography style={{ paddingLeft: '10px' }}>{pet.weight}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography style={{ minWidth: '80px' }}>DOB :</Typography>
                  <Typography style={{ paddingLeft: '20px' }}>{pet.dob}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography style={{ minWidth: '80px' }}>Pet ID :</Typography>
                  <Typography style={{ paddingLeft: '20px' }}>{pet.p_id}</Typography>
                </div>
                <Button variant="contained" color="primary" size="small" onClick={handleEditClick} style={{ marginTop: '10px' }}>
                  Edit Details
                </Button>
                {(userRole === 'admin' || userRole === 'doctor') && (
                  <Button variant="contained" color="primary" size="small" onClick={handleNotificationClick} style={{ marginTop: '10px', marginLeft: '10px' }}>
                    Add Reminder
                  </Button>
                )}

                {/* Button to add prescriptions */}
                {userRole === 'doctor' && (
                    <Button variant="contained" color="primary" size="small" onClick={handleAddPrescriptionOpen} style={{ marginTop: '10px', marginLeft: '10px' }}>
                      Add Prescription
                    </Button>
                )}

                <Button variant="contained" color="primary" size="small" onClick={handlePrintClick} style={{ marginTop: '10px', marginLeft: '10px' }}>
                  Print Report
                </Button>

              </>
            )}
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'470px', scrollbarWidth: 'none'}}>
              <Table stickyHeader aria-label="simple table" sx={{ minWidth: 650 }} >
                <TableHead >
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Prescription ID</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Vaccine</TableCell>
                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Dosage</TableCell>
                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Doctor</TableCell>

                    {userRole === 'doctor' && (
                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                    )}

                  </TableRow>
                </TableHead>
                <TableBody style={{ overflowY: 'scroll'}}>
                  {prescriptions.map((row) => (
                    <TableRow key={row.pres_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{row.pres_id}</TableCell>
                      <TableCell>{row.drug_name}</TableCell>
                      <TableCell align="right">{row.dosage}</TableCell>
                      <TableCell align="right">{new Date(row.presdate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{row.des}</TableCell>
                      <TableCell align="right">{row.first_name}</TableCell>

                      {userRole === 'doctor' && (
                      <TableCell align="right">
                        <Button variant="outlined" color="secondary" onClick={() => {
                          setDeleteDialogOpen(true);
                          setPrescriptionToDelete(row.pres_id);
                        }}>Delete</Button>
                      </TableCell>
                      )}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {showReport && (
          <VaccinationReport petId={petId} onGenerateComplete={() => setShowReport(false)} />
        )}        


          {/* Add Reminder Dialog */}
          <AddReminder
            petId={petId}
            open={notificationDialogOpen}
            onClose={handleNotificationClose}
            onAdd={handleNotificationAdd}
            userId={userId}
          />

        {/* Edit Pet Details Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Pet Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update the pet details, please edit the fields below and click "Save".
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="pet_name"
              label="Pet Name"
              type="text"
              fullWidth
              value={editPetData.pet_name}
              onChange={handleEditChange}
              error={errors.pet_name ? true : false}
              helperText={errors.pet_name}
            />
            <TextField
              margin="dense"
              name="breed"
              label="Breed"
              type="text"
              fullWidth
              value={editPetData.breed}
              onChange={handleEditChange}
              error={errors.pet_name ? true : false}
              helperText={errors.breed}
            />
            <TextField
              margin="dense"
              name="weight"
              label="Weight (Kg)"
              type="number"
              fullWidth
              value={editPetData.weight}
              onChange={handleEditChange}
              error={errors.pet_name ? true : false}
              helperText={errors.weight}
            />
            <TextField
              margin="dense"
              name="dob"
              label="Date of Birth"
              type="date"
              fullWidth
              value={editPetData.dob}
              onChange={handleEditChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} color="primary" disabled={!isFormValid()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Prescription Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Delete Prescription</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this prescription?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeletePrescription} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Prescription Modal */}
        <AddPrescription
          petId={petId}
          open={addPrescriptionOpen}
          onClose={handleAddPrescriptionClose}
          onAdd={() => {
            fetchPetDetails();
            fetchPrescriptions();
          }}
          userId={userId}
        />
      </Container>
    </React.Fragment>
  );
};

export default PetTable2;