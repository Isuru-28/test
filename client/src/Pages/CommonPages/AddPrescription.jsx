import React, { useState, useEffect } from 'react';
import { TextField, Button, Modal, Box, Typography, IconButton, MenuItem, Container } from '@mui/material';
import axios from 'axios';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const AddPrescription = ({ petId, open, onClose, onAdd, userId }) => {
  const [prescriptions, setPrescriptions] = useState([{ drugId: '', dosage: '', presdate: '', description: '' }]);
  const [drugs, setDrugs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [dosageErrors, setDosageErrors] = useState([false]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/drugs/form');
        setDrugs(response.data);
      } catch (error) {
        console.error('Error fetching drugs:', error);
      }
    };

    fetchDrugs();
  }, []);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index][name] = value;
    setPrescriptions(newPrescriptions);

    // Only validate dosage field
    if (name === 'dosage') {
      const dosageValue = parseInt(value, 10);
      const newDosageErrors = [...dosageErrors];
      if (!Number.isInteger(dosageValue) || dosageValue <= 0) {
        newDosageErrors[index] = true;
      } else {
        newDosageErrors[index] = false;
      }
      setDosageErrors(newDosageErrors);
    }
  };

  const handleAddPrescriptionField = () => {
    setPrescriptions([...prescriptions, { drugId: '', dosage: '', presdate: '', description: '' }]);
    setDosageErrors([...dosageErrors, false]);
  };

  const handleRemovePrescriptionField = (index) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
    const newDosageErrors = dosageErrors.filter((_, i) => i !== index);
    setDosageErrors(newDosageErrors);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    try {
      const data = {
        prescriptions: prescriptions.map(p => ({
          drug_id: p.drugId,
          dosage: p.dosage,
          presdate: p.presdate,
          des: p.description
        })),
        doc_id: userId,
        pet_id: petId
      };

      await axios.post('http://localhost:3001/api/prescriptions', data);
      onAdd(); // Call the callback function to refresh prescription data
      onClose(); // Close the modal
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.availableQuantity !== undefined) {
          setErrorMessage(`${error.response.data.error}. Available quantity: ${error.response.data.availableQuantity}`);
        } else {
          setErrorMessage(error.response.data.error);
        }
      } else {
        console.error('Error adding prescription:', error);
        setErrorMessage('Failed to add prescription. Please try again later.');
      }
    }
  };

  const isFormValid = () => {
    return prescriptions.every((prescription, index) => {
      return (
        prescription.drugId &&
        prescription.dosage &&
        prescription.presdate &&
        (!prescription.description || prescription.description.trim()) &&
        !dosageErrors[index]
      );
    });
  };  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-prescription-modal"
      aria-describedby="add-prescription-form"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
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
          Add Prescription
        </Typography>

        <Typography variant="body1" gutterBottom>
          Doctor ID: {userId}
        </Typography>

        <Container sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {prescriptions.map((prescription, index) => (
            <Box key={index} mb={2}>
              <TextField
                select
                margin="dense"
                name="drugId"
                label="Drug"
                fullWidth
                value={prescription.drugId}
                onChange={(event) => handleChange(index, event)}
              >
                {drugs.map((drug) => (
                  <MenuItem key={drug.drug_id} value={drug.drug_id}>
                  {`${drug.drug_name} (Exp: ${new Date(drug.exp_date).toLocaleDateString()}) - Available: ${drug.quantity}`}
                </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="dosage"
                label="Dosage"
                type="number"
                fullWidth
                value={prescription.dosage}
                onChange={(event) => handleChange(index, event)}
                error={dosageErrors[index]}
                helperText={dosageErrors[index] ? 'Dosage must be a positive integer' : ''}
              />
              <TextField
                margin="dense"
                name="presdate"
                label="Prescription Date"
                type="date"
                fullWidth
                value={prescription.presdate}
                onChange={(event) => handleChange(index, event)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: { min: '1900-01-01', max: '2100-12-31' } // Ensure proper range for date picker
                }}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                value={prescription.description}
                onChange={(event) => handleChange(index, event)}
              />
              {index > 0 && (
                <IconButton onClick={() => handleRemovePrescriptionField(index)}>
                  <RemoveIcon />
                </IconButton>
              )}
              <IconButton onClick={handleAddPrescriptionField}>
                <AddIcon />
              </IconButton>
            </Box>
          ))}
        </Container>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!isFormValid()}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPrescription;
