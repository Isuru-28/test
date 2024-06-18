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
  Typography,
  Container,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const PaymentsPetPage = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const petId = user.userId || '';

  // Fetch payment records for the pet
  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/payments/pet/${petId}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments.');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'605px', scrollbarWidth: 'none'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Bill ID</TableCell>
              <TableCell>Owner Name</TableCell>
              <TableCell>Pet Name</TableCell>
              <TableCell>Prescription ID</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Bill Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ overflowY: 'scroll'}}>
            {payments.map((payment) => (
              <TableRow key={payment.bill_id}>
                <TableCell>{payment.bill_id}</TableCell>
                <TableCell>{payment.first_name}</TableCell>
                <TableCell>{payment.pet_name}</TableCell>
                <TableCell>{payment.pres_id}</TableCell>
                <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.total_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    </React.Fragment>
  );
};

export default PaymentsPetPage;
