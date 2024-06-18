const db = require('../db');
const bcrypt = require('bcryptjs');

// Get user details based on user ID and role
const getUserProfile = async (req, res) => {
    const { id, user_role } = req.params;

    if (!id || !user_role) {
        return res.status(400).json({ message: 'Missing user ID or role' });
    }

    let query;
    switch (user_role) {
        case 'admin':
            query = 'SELECT * FROM admins WHERE a_id = ?';
            break;
        case 'doctor':
            query = 'SELECT * FROM doctors WHERE d_id = ?';
            break;
        case 'receptionist':
            query = 'SELECT * FROM receptionists WHERE r_id = ?';
            break;
        case 'pet_owner':
            query = 'SELECT * FROM pets WHERE p_id = ?';
            break;
        default:
            return res.status(400).json({ message: 'Invalid user role' });
    }

    try {
        const [results] = await db.query(query, [id]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).json({ message: 'Database query error', error: error.message });
    }
};

// Update user profile details based on ID and role
const updateUserProfile = async (req, res) => {
    const { id, user_role } = req.params;
    const { email, password, ...otherFields } = req.body;

    if (!id || !user_role) {
        return res.status(400).json({ message: 'Missing user ID or role' });
    }

    let tableName, idField;
    switch (user_role) {
        case 'admin':
            tableName = 'admins';
            idField = 'a_id';
            break;
        case 'doctor':
            tableName = 'doctors';
            idField = 'd_id';
            break;
        case 'receptionist':
            tableName = 'receptionists';
            idField = 'r_id';
            break;
        case 'pet_owner':
            tableName = 'pets';
            idField = 'p_id';
            break;
        default:
            return res.status(400).json({ message: 'Invalid user role' });
    }

    let query = `UPDATE ${tableName} SET `;
    const updateFields = [];
    const values = [];

    if (email) {
        updateFields.push('email = ?');
        values.push(email);
    }

    for (const [key, value] of Object.entries(otherFields)) {
        updateFields.push(`${key} = ?`);
        values.push(value);
    }

    if (updateFields.length > 0) {
        query += updateFields.join(', ') + ` WHERE ${idField} = ?`;
        values.push(id);

        try {
            await db.query(query, values);

            if (email || password) {
                const userUpdateFields = [];
                const userValues = [];

                if (email) {
                    userUpdateFields.push('email = ?');
                    userValues.push(email);
                }

                if (password) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    userUpdateFields.push('password = ?');
                    userValues.push(hashedPassword);
                }

                if (userUpdateFields.length > 0) {
                    const userQuery = `UPDATE users SET ${userUpdateFields.join(', ')} WHERE id = ?`;
                    userValues.push(id);

                    await db.query(userQuery, userValues);
                }
            }

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            console.error('Database update error:', error.message);
            res.status(500).json({ message: 'Database update error', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'No fields to update' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
