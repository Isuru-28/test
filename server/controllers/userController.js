const db = require('../db');
// const bcrypt = require('bcrypt');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.id, u.email, u.role AS userType, p.first_name AS firstName, p.contact, p.pet_name AS petName 
      FROM users u
      LEFT JOIN pets p ON u.id = p.p_id
      WHERE u.role = 'pet_owner'
      UNION
      SELECT u.id, u.email, u.role AS userType, d.first_name AS firstName, d.contact, NULL AS petName 
      FROM users u
      LEFT JOIN doctors d ON u.id = d.d_id
      WHERE u.role = 'doctor'
      UNION
      SELECT u.id, u.email, u.role AS userType, r.first_name AS firstName, r.contact, NULL AS petName 
      FROM users u
      LEFT JOIN receptionists r ON u.id = r.r_id
      WHERE u.role = 'receptionist';
    `);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;

  try {
    if (userType === 'pet_owner') {
      await db.query('DELETE FROM pets WHERE p_id = ?', [id]);
    } else if (userType === 'doctor') {
      await db.query('DELETE FROM doctors WHERE d_id = ?', [id]);
    } else if (userType === 'receptionist') {
      await db.query('DELETE FROM receptionists WHERE r_id = ?', [id]);
    }
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, firstName, contact, petName } = req.body;

  try {
    // Update email in users table
    await db.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);

    // Fetch user role
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userType = rows[0].role;

    // Update relevant table based on user role
    if (userType === 'pet_owner') {
      await db.query('UPDATE pets SET email = ?, first_name = ?, contact = ?, pet_name = ? WHERE p_id = ?', [email, firstName, contact, petName, id]);
    } else if (userType === 'doctor') {
      await db.query('UPDATE doctors SET email = ?, first_name = ?, contact = ? WHERE d_id = ?', [email, firstName, contact, id]);
    } else if (userType === 'receptionist') {
      await db.query('UPDATE receptionists SET email = ?, first_name = ?, contact = ? WHERE r_id = ?', [email, firstName, contact, id]);
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
  