import React, { useState, useEffect } from 'react';
import { Typography, TextField } from '@mui/material';

const BillContent = ({ petName, setPetName, owner, setOwner, contact, setContact, drugs, totalAmount, prescriptionRecords, drugsList }) => {

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);
    
  return (
    <div id="bill-content" style={{ border: '1px solid #000', padding: '20px', borderRadius: '5px', maxWidth: '600px', marginTop:'10px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h5">Pet Animal Clinic</Typography>
        <Typography variant="subtitle1">Contact: (071) 838-8371</Typography>
        <Typography variant="subtitle1">Address: Total Pet Care, Mailagas Junction, Anuradhapura</Typography>
        <Typography variant="subtitle1">Email: totalpetcare@gmail.com</Typography>
        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Date: {currentDate}</Typography>
      </div>


      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', borderBottom: '1px solid transparent' }}>
        <Typography variant="body1" sx={{ minWidth: '80px' }}>Pet Name:</Typography>
        <TextField
            variant="outlined"
            size="small"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            sx={{
            flex: 1,
            height: '30px',
            borderRadius: 0,
            border: 'none',
            }}
            InputProps={{ sx: { border: 'none' } }}
        />
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', borderBottom: '1px solid transparent' }}>
        <Typography variant="body1" sx={{ minWidth: '80px' }}>Owner:</Typography>
        <TextField
            variant="outlined"
            size="small"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            sx={{
            flex: 1,
            height: '30px',
            borderRadius: 0,
            border: 'none',
            }}
            InputProps={{ sx: { border: 'none' } }}
        />
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', borderBottom: '0px solid transparent' }}>
        <Typography variant="body1" sx={{ minWidth: '80px' }}>Contact:</Typography>
        <TextField
            variant="outlined"
            size="small"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            sx={{
            flex: 1,
            height: '30px',
            borderRadius: 0,
            border: 'none',
            }}
            InputProps={{ sx: { border: 'none' } }}
        />
        </div>

        <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Vaccine</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Dosage</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Cost</th>
            </tr>
            </thead>
            <tbody>
            {drugs.map((drug, index) => (
                <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{drug.drug_name}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{drug.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>Rs. {(drug.unit_price * drug.quantity).toFixed(2)}</td>
                </tr>
            ))}
            {prescriptionRecords.map((record, index) => (
                <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{record.drug_name}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{record.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  Rs. {(drugsList.find(drug => drug.drug_id === record.drug_id)?.unit_price * record.quantity || 'N/A')}
                </td>
                </tr>
            ))}
            <tr>
                <td style={{ border: '1px solid #000', padding: '8px' }} colSpan="2">Subtotal:</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>Rs. {totalAmount.toFixed(2)}</td>
            </tr>
            </tbody>
        </table>
        </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="subtitle1">Thank you for visiting our clinic!</Typography>
        <Typography variant="subtitle1">For inquiries, call us at (071) 838-8371</Typography>
      </div>
    </div>
  );
};

export default BillContent;
