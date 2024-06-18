import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function createData(transactionId, petId, amount, date, paymentType) {
  return { transactionId, petId, amount, date, paymentType };
}

const rows = [
  createData('TRX001', 'P001', 100, '2024-04-15', 'Card'),
  createData('TRX002', 'P002', 150, '2024-04-16', 'Cash'),
  // Add more rows as needed
];

export default function DocReports() {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredRows = rows.filter(row =>
    row.transactionId.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.petId.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.amount.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
    row.date.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.paymentType.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="lg">


    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' , paddingTop:'5px' }}>
        <Typography variant="body1" style={{ marginRight: '10px' }}>{`Total Transactions: ${filteredRows.length}`}</Typography>
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>Transaction ID</TableCell>
              <TableCell sx={{ width: 150 }}>Pet ID</TableCell>
              <TableCell sx={{ width: 150 }}>Amount</TableCell>
              <TableCell sx={{ width: 150 }}>Date</TableCell>
              <TableCell sx={{ width: 150 }}>Payment Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.transactionId}>
                <TableCell component="th" scope="row">
                  {row.transactionId}
                </TableCell>
                <TableCell>{row.petId}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  {row.paymentType}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

    </Container>
    </React.Fragment>
  );
}
