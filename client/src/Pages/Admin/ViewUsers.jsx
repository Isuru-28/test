import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import AddUser from './AddUser';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import axios from 'axios';

function ViewUsers() {
  const [userData, setUserData] = useState([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [editableRows, setEditableRows] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users', { withCredentials: true });
      setUserData(response.data);
      // Initialize editableRows state with false for each row
      setEditableRows(Array(response.data.length).fill(false));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, userType) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        data: { userType },
        withCredentials: true,
      });
      fetchData(); // Refresh the user list after deleting a user
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (index) => {
    // Toggle the editable state for the selected row
    const newEditableRows = [...editableRows];
    newEditableRows[index] = !newEditableRows[index];
    setEditableRows(newEditableRows);
  };

  const handleApply = async (index, id, userType) => {
    // Prepare the updated user data
    const updatedUserData = {
      email: userData[index].email,
      firstName: userData[index].firstName,
      contact: userData[index].contact,
    };
    // Add pet name if the user type is 'pet_owner'
    if (userType === 'pet_owner') {
      updatedUserData.petName = userData[index].petName;
    }
    // Update the user data in the database
    try {
      await axios.put(`http://localhost:3001/api/users/${id}`, updatedUserData, { withCredentials: true });
      fetchData(); // Refresh the user list after updating a user
    } catch (error) {
      console.error('Error updating user:', error);
    }
    // Toggle back to read-only mode after applying changes
    handleEdit(index);
  };

  const handleInputChange = (index, field, value) => {
    // Update the user data in the state
    const newUserData = [...userData];
    newUserData[index][field] = value;
    setUserData(newUserData);
  };



  const validateEmail = (email) => {
    const emailRegex = /^[^@]+@[^@]+\.[a-z]{3}$/;
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    const contactRegex = /^[0-9]{10}$/;
    return contactRegex.test(contact);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  const isRowValid = (index) => {
    const user = userData[index];
    console.log('Validating row:', index, user);

    if (
      !user.firstName ||
      !validateName(user.firstName) ||
      !user.email ||
      !validateEmail(user.email) ||
      !user.contact ||
      !validateContact(user.contact)
    ) {
      console.log('Row is invalid due to:', {
        firstName: validateName(user.firstName),
        email: validateEmail(user.email),
        contact: validateContact(user.contact),
      });
      return false;
    }
    if (user.userType === 'pet_owner' && (!user.petName || !validateName(user.petName))) {
      console.log('Row is invalid due to petName:', user.petName);
      return false;
    }
    console.log('Row is valid');
    return true;
  };

  // Filtered user data based on searchTerm for both firstName and petName
  const filteredUsers = userData.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.userType === 'pet_owner' && user.petName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <div style={{ paddingTop: '5px' }}>
          <Modal
            open={openAddUserModal}
            onClose={() => setOpenAddUserModal(false)}
            aria-labelledby="add-user-modal"
            aria-describedby="add-user-form"
          >
            <div>
              <AddUser fetchData={fetchData} />
            </div>
          </Modal>
          <div style={{ display: 'flex', alignItems: 'center' }}>         
              <AddUser fetchData={fetchData} />

              <TextField
              label="Search by First Name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px', marginLeft: '10px' }}
            />       
          </div>

          
          <div style={{ paddingTop: '10px' }}>
            <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight:'540px', scrollbarWidth: 'none'}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Pet Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ overflowY: 'scroll'}}>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="text"
                            value={user.firstName}
                            onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                          />
                        ) : (
                          user.firstName
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="text"
                            value={user.email}
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <input
                            type="text"
                            value={user.contact}
                            onChange={(e) => handleInputChange(index, 'contact', e.target.value)}
                          />
                        ) : (
                          user.contact
                        )}
                      </TableCell>
                      <TableCell>
                        {user.userType === 'pet_owner' ? (
                          editableRows[index] ? (
                            <input
                              type="text"
                              value={user.petName}
                              onChange={(e) => handleInputChange(index, 'petName', e.target.value)}
                            />
                          ) : (
                            user.petName
                          )
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[index] ? (
                          <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApply(index, user.id, user.userType)}
                          disabled={!isRowValid(index)}
                        >
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
                          onClick={() => handleDelete(user.id, user.userType)}
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

export default ViewUsers;
