import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import axios from 'axios';

function PetTable() {
  const [petsData, setPetsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Retrieve the current logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role || '';

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pets');
      setPetsData(response.data);
    } catch (error) {
      console.error('Error fetching pets data:', error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPets = searchTerm
    ? petsData.filter((pet) =>
        pet.petName && pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : petsData;

  const handleRowClick = (petId) => {
    navigate(`/${userRole}/pets/${petId}`);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <div style={{ paddingTop: '5px' }}>
          <input
            type="text"
            placeholder="Search by Pet Name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '10px' }}
          />
          <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'605px', scrollbarWidth: 'none'}}>
            <Table>
              <TableHead stickyHeader>
                <TableRow>
                  <TableCell>Pet ID</TableCell>
                  <TableCell>Pet Name</TableCell>
                  <TableCell>Age (yrs)</TableCell>
                  <TableCell>Weight (Kg)</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflowY: 'scroll'}}>
                {filteredPets.map((pet) => (
                  <TableRow key={pet.p_id} onClick={() => handleRowClick(pet.p_id)} style={{ cursor: 'pointer' }}>
                    <TableCell>{pet.p_id}</TableCell>
                    <TableCell>{pet.petName}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>{pet.weight || ''}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.ownerName || ''}</TableCell>
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

export default PetTable;
