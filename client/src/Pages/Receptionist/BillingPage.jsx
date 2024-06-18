import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Select, MenuItem, TextField, Grid, IconButton } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BillContent from './BillContent';
import { Delete as DeleteIcon } from '@mui/icons-material';

const BillingPage = () => {
  const [manualDrugs, setManualDrugs] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [drugsList, setDrugsList] = useState([]);
  const [error, setError] = useState(null);
  const [petName, setPetName] = useState('');
  const [owner, setOwner] = useState('');
  const [contact, setContact] = useState('');
  const [registeredPet, setRegisteredPet] = useState(false);
  const [petId, setPetId] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [prescriptionRecords, setPrescriptionRecords] = useState([]);

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.userId || '';

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/drug/bill');
      setDrugsList(response.data);
    } catch (error) {
      setError('Failed to fetch drugs.');
    }
  };

  const handleAddDrug = () => {
    setManualDrugs([...manualDrugs, { drug_id: '', quantity: 0, unit_price: 0, drug_name: '' }]);
  };

  const handleDrugChange = (index, key, value) => {
    const updatedDrugs = [...manualDrugs];
    updatedDrugs[index][key] = value >= 0 ? Math.floor(value) : 0;

    if (key === 'drug_id') {
      const selectedDrug = drugsList.find(d => d.drug_id === value);
      updatedDrugs[index]['unit_price'] = selectedDrug ? parseFloat(selectedDrug.unit_price) : 0;
      updatedDrugs[index]['drug_name'] = selectedDrug ? selectedDrug.drug_name : '';
    }

    setManualDrugs(updatedDrugs);
  };

  const handleRemoveDrug = (index) => {
    const updatedDrugs = manualDrugs.filter((_, i) => i !== index);
    setManualDrugs(updatedDrugs);
  };

//   const handleCalculateTotal = () => {
//     const total = manualDrugs.reduce((sum, drug) => sum + drug.unit_price * drug.quantity, 0);
//     setTotalAmount(total);
//   };

const handleCalculateTotal = () => {
    let total = 0;
  
    // Calculate total for manually added drugs
    total += manualDrugs.reduce((sum, drug) => sum + drug.unit_price * drug.quantity, 0);
  
    // Add total for drugs from prescription
    total += prescriptionRecords.reduce((sum, record) => {
      const drug = drugsList.find(d => d.drug_id === record.drug_id);
      if (drug) {
        return sum + drug.unit_price * record.quantity;
      }
      return sum;
    }, 0);
  
    setTotalAmount(total);
  };
  

//   const handleSaveBill = () => {
//     const payload = {
//       receptionist_id: userId,
//       total_amount: totalAmount,
//       pet_id: registeredPet ? petId : null,
//       pres_id: registeredPet ? prescriptionId : null,
//       drugs: manualDrugs,
//       pet_name: petName,
//     };

//     axios.post('http://localhost:3001/api/payments/savepayment', payload)
//       .then(response => {
//         alert('Payment saved successfully');
//       })
//       .catch(error => {
//         setError('Failed to save payment.');
//       });
//   };

//   const handleSaveBill = () => {
//     const payload = {
//       receptionist_id: userId,
//       total_amount: totalAmount,
//       pet_id: registeredPet ? petId : null,
//       pres_id: registeredPet ? prescriptionId : null,
//       drugs: manualDrugs,
//       pet_name: petName,
//     };
  
//     axios.post('http://localhost:3001/api/payments/savepayment', payload)
//       .then(response => {
//         alert(response.data.message); // Display the message from the backend
//       })
//       .catch(error => {
//         if (error.response && error.response.data && error.response.data.message) {
//           setError(error.response.data.message);
//         } else {
//           setError('Failed to save payment.');
//         }
//       });
//   };
  
const handleSaveBill = () => {
    const payload = {
      receptionist_id: userId,
      total_amount: totalAmount,
      pet_id: registeredPet ? petId : null,
      pres_id: registeredPet ? prescriptionId : null,
      drugs: manualDrugs,
      pet_name: petName,
      first_name: owner,
    };
  
    axios.post('http://localhost:3001/api/payments/savepayment', payload)
      .then(response => {
        alert(response.data.message);
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
          setTimeout(() => {
            setError(null); // Clear the error message after 2 seconds
          }, 2000);
        } else {
          setError('Failed to save payment.');
          setTimeout(() => {
            setError(null); // Clear the error message after 2 seconds
          }, 2000);
        }
      });
  };
  
  

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pdfContent = document.getElementById('bill-content');

    if (!pdfContent) {
      console.error('PDF content element not found');
      return;
    }

    await html2canvas(pdfContent, { scale: 2 })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      })
      .catch(error => {
        console.error('Error capturing content:', error);
      });

    doc.save('bill.pdf');
  };

  const handlePetRegistrationChange = (event) => {
    setRegisteredPet(event.target.checked);
    setPetId('');
    setPrescriptionId('');
    setPrescriptionRecords([]);
  };

  const handlePetIdChange = (event) => {
    setPetId(event.target.value);
  };

  const handlePrescriptionIdChange = (event) => {
    setPrescriptionId(event.target.value);
  };

  const handleFetchPetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pets/${petId}`);
      const { pet_name, first_name, contact } = response.data;
      setPetName(pet_name);
      setOwner(first_name);
      setContact(contact);

      const prescriptionResponse = await axios.get(`http://localhost:3001/api/prescriptions/record/${prescriptionId}`);
      const prescriptionData = prescriptionResponse.data;
      setPrescriptionRecords(prescriptionData);

      let totalAmount = 0;
      prescriptionData.forEach(record => {
        const drug = drugsList.find(d => d.drug_id === record.drug_id);
        if (drug) {
          totalAmount += drug.unit_price * record.quantity;
        }
      });
      setTotalAmount(totalAmount);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      setError('Failed to fetch pet details.');
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div>
              <Typography variant="h6">Billing Page</Typography>
              <div>
                <label>
                  <input type="checkbox" checked={registeredPet} onChange={handlePetRegistrationChange} />
                  Is Pet Registered?
                </label>
                {registeredPet && (
                  <div>
                    <TextField
                      label="Pet ID"
                      value={petId}
                      onChange={handlePetIdChange}
                    />
                    <TextField
                      label="Prescription ID"
                      value={prescriptionId}
                      onChange={handlePrescriptionIdChange}
                    />
                    <Button onClick={handleFetchPetDetails}>Fetch Pet Details</Button>
                  </div>
                )}
              </div>
              <div>
                {manualDrugs.map((drug, index) => (
                  <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <Select
                      value={drug.drug_id || ''}
                      onChange={e => handleDrugChange(index, 'drug_id', e.target.value)}
                      displayEmpty
                      sx={{ width: '200px', height: '40px', marginRight: '10px', padding: '0px' }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: '150px', // Limit the dropdown height
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a drug</em>
                      </MenuItem>
                      {drugsList.map(d => (
                        <MenuItem key={d.drug_id} value={d.drug_id}>
                          {`${d.drug_name} (Exp: ${new Date(d.exp_date).toLocaleDateString()}) - Available: ${d.quantity}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={drug.quantity}
                      onChange={e => handleDrugChange(index, 'quantity', parseInt(e.target.value, 10))}
                      sx={{ width: '100px', height: '40px', marginRight: '10px' }}
                      InputProps={{
                        style: { height: '40px', padding: '0 10px' }
                      }}
                    />
                    <Typography display="inline" sx={{ fontSize: '14px', marginRight: '10px' }}>
                      Unit Price: Rs. {drug.unit_price || 0}
                    </Typography>
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveDrug(index)}
                      sx={{ height: '40px' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button onClick={handleAddDrug} sx={{ marginTop: '10px' }}>Add Drug</Button>
              </div>

              <Button onClick={handleCalculateTotal} sx={{ marginTop: '10px' }}>Calculate Total</Button>
              {totalAmount > 0 && <Typography>Total Amount: Rs. {totalAmount.toFixed(2)}</Typography>}
              <Button onClick={handleSaveBill} sx={{ marginTop: '10px' }}>Save Bill</Button>
              {totalAmount > 0 && (
                <Button onClick={generatePDF} sx={{ marginTop: '10px' }}>Download Bill as PDF</Button>
              )}
            </div>
          </Grid>
          <Grid item xs={6}>
            <BillContent
              petName={petName}
              setPetName={setPetName}
              owner={owner}
              setOwner={setOwner}
              contact={contact}
              setContact={setContact}
              drugs={manualDrugs}
              totalAmount={totalAmount}
              prescriptionRecords={prescriptionRecords}
              drugsList={drugsList}
            />
          </Grid>
        </Grid>

        {error && <Typography color="error">{error}</Typography>}
      </Container>
    </React.Fragment>
  );
};

export default BillingPage;
