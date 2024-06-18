import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import AddDrug from './AddDrug';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import axios from 'axios';

function Inventory() {
  const [drugsData, setDrugsData] = useState([]);
  const [openAddDrugModal, setOpenAddDrugModal] = useState(false);
  const [editableRows, setEditableRows] = useState([]);

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/drugs');
      setDrugsData(response.data);
      setEditableRows(Array(response.data.length).fill(false));
    } catch (error) {
      console.error('Error fetching drugs data:', error);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleDelete = async (drugId) => {
    try {
      await axios.delete(`http://localhost:3001/api/drugs/${drugId}`);
      fetchDrugs();
    } catch (error) {
      console.error('Error deleting drug:', error);
    }
  };

  const handleEdit = (index) => {
    const newEditableRows = [...editableRows];
    newEditableRows[index] = !newEditableRows[index];
    setEditableRows(newEditableRows);
  };

  const handleApply = async (index, id) => {
    const updatedDrugData = {
      drugName: drugsData[index].drug_name,
      unitPrice: drugsData[index].unit_price,
      quantity: drugsData[index].quantity,
      expDate: drugsData[index].exp_date.split('T')[0]  // Ensure the date is in the format YYYY-MM-DD
    };

    console.log('Updating drug with ID:', id);
    console.log('Updated data:', updatedDrugData);

    try {
      await axios.put(`http://localhost:3001/api/drugs/${id}`, updatedDrugData);
      fetchDrugs();
    } catch (error) {
      console.error('Error updating drug:', error);
    }
    handleEdit(index);
  };

  const handleInputChange = (index, field, value) => {
    const newDrugsData = [...drugsData];
    newDrugsData[index] = {
      ...newDrugsData[index],
      [field]: value
    };
    setDrugsData(newDrugsData);
  };

  const isRowValid = (index) => {
    const drug = drugsData[index];
    return (
      drug.unit_price > 0 &&
      drug.quantity > 0 &&
      Number.isInteger(Number(drug.quantity)) &&
      new Date(drug.exp_date) > new Date()
    );
  };  

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <div style={{ paddingTop: '5px' }}>
        <Modal
            open={openAddDrugModal}
            onClose={() => setOpenAddDrugModal(false)}
            aria-labelledby="add-drug-modal"
            aria-describedby="add-drug-form"
          >
            <div>
              <AddDrug fetchDrugs={fetchDrugs} />
            </div>
          </Modal>
          <AddDrug fetchDrugs={fetchDrugs} />

          <div style={{ paddingTop: '10px' }}>
            <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'600px', scrollbarWidth: 'none'}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Drug Name</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Expire Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ overflowY: 'scroll'}}>
                  {drugsData.map((drug, index) => (
                    <TableRow key={drug.drug_id}>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="text"
                            value={drug.drug_name}
                            onChange={(e) => handleInputChange(index, 'drug_name', e.target.value)}
                          />
                        ) : (
                          drug.drug_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="number"
                            value={drug.unit_price}
                            onChange={(e) => handleInputChange(index, 'unit_price', e.target.value)}
                          />
                        ) : (
                          drug.unit_price
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="number"
                            value={drug.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                          />
                        ) : (
                          drug.quantity
                        )}
                      </TableCell>
                      <TableCell>{new Date(drug.updated_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="date"
                            value={drug.exp_date.split('T')[0]}  // Format the date for input field
                            onChange={(e) => handleInputChange(index, 'exp_date', e.target.value)}
                          />
                        ) : (
                          new Date(drug.exp_date).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <Button variant="contained" color="primary" onClick={() => handleApply(index, drug.drug_id)} disabled={!isRowValid(index)}>
                            Apply
                          </Button>
                        ) : (
                          <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(drug.drug_id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Inventory;
