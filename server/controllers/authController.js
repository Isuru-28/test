// controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');

// // admin registration
// exports.registerAdmin = async (req, res) => {
//   const { email, password, first_name, last_name, contact } = req.body;

//   try {
//     const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await db.query(
//       'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
//       [email, hashedPassword, 'admin']
//     );

//     const userId = result.insertId;

//     await db.query(
//       'INSERT INTO admins (a_id, email, first_name, last_name, contact) VALUES (?, ?, ?, ?, ?)',
//       [userId, email, first_name, last_name, contact]
//     );

//     res.status(201).json({ message: 'Admin registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// Register a new pet owner
exports.registerPetOwner = async (req, res) => {
  const { email, password, first_name, last_name, contact, pet_name, breed, gender, weight, dob } = req.body;

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'pet_owner']
    );

    const userId = result.insertId;

    await db.query(
      'INSERT INTO pets (p_id, email, first_name, last_name, contact, pet_name, breed, gender, weight, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, email, first_name, last_name, contact, pet_name, breed, gender, weight, dob]
    );

    res.status(201).json({ message: 'Pet owner registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Register a pet owner by admin
exports.registerPetOwnerByAdmin = async (req, res) => {
  const { email, password, first_name, last_name, contact, pet_name, breed, gender, weight, dob } = req.body;

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'pet_owner']
    );

    const userId = result.insertId;

    await db.query(
      'INSERT INTO pets (p_id, email, first_name, last_name, contact, pet_name, breed, gender, weight, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, email, first_name, last_name, contact, pet_name, breed, gender, weight, dob]
    );

    res.status(201).json({ message: 'Pet owner registered successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Register a new doctor or receptionist (admin only)
exports.registerUserByAdmin = async (req, res) => {
  const { email, password, role, first_name, last_name, contact } = req.body;

  if (role !== 'doctor' && role !== 'receptionist') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    const userId = result.insertId;
    const tableName = role === 'doctor' ? 'doctors' : 'receptionists';
    const columnId = role === 'doctor' ? 'd_id' : 'r_id';

    await db.query(
      `INSERT INTO ${tableName} (${columnId}, email, first_name, last_name, contact) VALUES (?, ?, ?, ?, ?)`,
      [userId, email, first_name, last_name, contact]
    );

    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;

    res.status(200).json({ message: 'Login successful', userId: user.id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Logout a user
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};
