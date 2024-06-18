// controllers/drugController.js

const db = require('../db');

// exports.getDrugsByPrescriptionId = async (req, res) => {
//   const { prescriptionId } = req.params;

//   try {
//     const [drugs] = await db.query(`
//       SELECT * FROM drugs
//       WHERE prescription_id = ?
//     `, [prescriptionId]);

//     res.status(200).json(drugs);
//   } catch (error) {
//     console.error('Error fetching drugs by prescription ID:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.getDrugsToBill = async (req, res) => {
  try {
    // Query the drugs from the database
    const [drugs] = await db.query('SELECT drug_id, drug_name, unit_price, exp_date, quantity FROM drugs WHERE quantity > 0 ORDER BY drug_name ');
    
    // Log the fetched drugs for debugging
    console.log('Fetched drugs:', drugs);

    // Check if drugs were fetched
    if (drugs.length === 0) {
      console.log('No drugs available with quantity > 0');
    }

    // Send the drugs as a JSON response
    res.status(200).json(drugs);
  } catch (error) {
    console.error('Error fetching drugs:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch the first 5 drugs items with the nearest expiration date
exports.getNearestExpireItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT drug_id, drug_name, exp_date, quantity
      FROM drugs
      ORDER BY exp_date ASC
      LIMIT 5;
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching nearest expire items:', error);
    res.status(500).json({ error: 'An error occurred while fetching nearest expire items' });
  }
};

