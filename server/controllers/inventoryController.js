const db = require('../db');

// Get all drugs
exports.getDrugs = async (req, res) => {
    try {
      const [drugs] = await db.query('SELECT * FROM drugs ORDER BY exp_date ASC');
      res.status(200).json(drugs);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Add a new drug
exports.addDrug = async (req, res) => {
  const { drugName, unitPrice, quantity, expDate } = req.body;

  try {
    // Insert the new drug into the database
    const [result] = await db.query(
      'INSERT INTO drugs (drug_name, unit_price, quantity, updated_date, exp_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)',
      [drugName, unitPrice, quantity, expDate]
    );

    const newDrugId = result.insertId;

    res.status(201).json({
      message: 'Drug added successfully',
      drugId: newDrugId,
    });
  } catch (error) {
    console.error('Error adding drug:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a drug
exports.deleteDrug = async (req, res) => {
    const { drugId } = req.params;
  
    try {
      // Delete the drug from the database
      await db.query('DELETE FROM drugs WHERE drug_id = ?', [drugId]);
  
      // Send a success response
      res.status(200).json({ message: 'Drug deleted successfully' });
    } catch (error) {
      // If an error occurs, send an error response
      console.error('Error deleting drug:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

// Update a drug
exports.updateDrug = async (req, res) => {
    const { drugId } = req.params;
    const { drugName, unitPrice, quantity, expDate } = req.body;
  
    try {
      // Update the drug in the database
      await db.query('UPDATE drugs SET drug_name = ?, unit_price = ?, quantity = ?, exp_date = ? WHERE drug_id = ?', 
                     [drugName, unitPrice, quantity, expDate, drugId]);
  
      // Send a success response
      res.status(200).json({ message: 'Drug updated successfully' });
    } catch (error) {
      // If an error occurs, send an error response
      console.error('Error updating drug:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

//get current stock for dashboard
exports.getCurrentStock = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT drug_id, drug_name, quantity, unit_price, exp_date FROM drugs WHERE quantity > 0');
    const currentStock = rows.map(row => ({ drug_id:row.drug_id, drug_name: row.drug_name, quantity: row.quantity, unit_price: row.unit_price, exp_date: row.exp_date}));
    res.status(200).json(currentStock);
  } catch (error) {
    console.error('Error fetching current stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
};