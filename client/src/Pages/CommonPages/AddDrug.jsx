import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function AddDrug({ fetchDrugs }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    drugName: '',
    unitPrice: '',
    quantity: '',
    expDate: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error when user starts typing
  };

  const isFormValid = () => {
    return (
      formData.unitPrice > 0 &&
      formData.quantity > 0 &&
      Number.isInteger(Number(formData.quantity)) &&
      new Date(formData.expDate) > new Date()
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      drugName: '',
      unitPrice: '',
      quantity: '',
      expDate: '',
    });
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/drugs', formData, { withCredentials: true });
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage('');
          handleClose();
          fetchDrugs(); // Refresh the drug list after adding a drug
        }, 3000); // Adjust the delay as needed (in milliseconds)
      } else {
        setErrorMessage('Adding drug failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Adding drug failed. Please try again.');
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add Drug
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-drug-modal"
        aria-describedby="add-drug-form"
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
            Add Drug
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Drug Name"
              name="drugName"
              value={formData.drugName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Unit Price (LKR)"
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              required
              error={errors.unitPrice && errors.unitPrice !== ''} // Check if there's an error message
              helperText={errors.unitPrice || (formData.unitPrice <= 0 ? 'Unit price should be greater than 0.' : '')}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              error={errors.quantity && errors.quantity !== ''} // Check if there's an error message
              helperText={errors.quantity || (formData.quantity <= 0 ? 'Quantity should be greater than 0.' : 
                          !Number.isInteger(Number(formData.quantity)) ? 'Quantity should be an integer.' : '')}
            />
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              name="expDate"
              value={formData.expDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px', marginRight: '8px' }}
              disabled={!isFormValid()}
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

export default AddDrug;
