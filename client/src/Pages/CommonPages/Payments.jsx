import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import PaymentReport from './PaymentReport';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(false); 
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  // Fetch payment records based on selected month and year
  const fetchPayments = async () => {
    try {
      // Log the data being sent to the backend
      const dataToSend = { month: selectedMonth, year: selectedYear };
      console.log('Data being sent to the backend:', dataToSend);

      const response = await axios.get('http://localhost:3001/api/payments/records', {
        params: dataToSend
      });
      setPayments(response.data);
      if (response.data.length === 0) {
        alert('No records found for the selected month and year.');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments.');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear]);

  // Delete payment record
  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:3001/api/payments/${paymentId}`);
      alert('Payment record deleted successfully.');
      fetchPayments(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting payment:', error);
      setError('Failed to delete payment.');
    }
  };

  // // Render delete button conditionally based on user role
  // const renderDeleteButton = (paymentId) => {
  //   if (userRole === 'admin' || userRole === 'receptionist') {
  //     return (
  //       <Button
  //         startIcon={<DeleteIcon />}
  //         color="secondary"
  //         onClick={() => deletePayment(paymentId)}
  //       >
  //         Delete
  //       </Button>
  //     );
  //   }
  //   return null;
  // };

  const handlePrintClick = () => {
    setShowReport(true);
  };

    // Create month options
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));
  
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 16 }, (_, i) => ({
      value: currentYear - i,
      label: currentYear - i,
    }));

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
      {error && <Typography color="error">{error}</Typography>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
          <TextField
            select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            variant="outlined"
            size="small"
            style={{ minWidth: '120px' }}
          >
            {months.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            variant="outlined"
            size="small"
            style={{ minWidth: '100px' }}
          >
            {years.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handlePrintClick}
          >
            Print Report
          </Button>
        </div>
      <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'590px', scrollbarWidth: 'none'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ height: '10px' }}>
              <TableCell>Bill ID</TableCell>
              <TableCell>Owner Name</TableCell>
              <TableCell>Pet Name</TableCell>
              <TableCell>Prescription ID</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Bill Amount</TableCell>
              <TableCell>  </TableCell>  
            </TableRow>
          </TableHead>
          <TableBody style={{ overflowY: 'scroll'}}>
            {payments.map((payment) => (
              <TableRow key={payment.bill_id} sx={{ height: '10px' }}> 
                <TableCell>{payment.bill_id}</TableCell>
                <TableCell>{payment.first_name}</TableCell>
                <TableCell>{payment.pet_name}</TableCell>
                <TableCell>{payment.pres_id}</TableCell>
                <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.total_amount}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={() => deletePayment(payment.bill_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showReport && (
          <PaymentReport
            month={selectedMonth}
            year={selectedYear}
            onGenerateComplete={() => setShowReport(false)}
          />
        )}

      </Container>
    </React.Fragment>
  );
};

export default PaymentsPage;
