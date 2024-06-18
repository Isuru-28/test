const db = require('../db');

// Get drugs to populate the form dropdown, only those with quantity > 0
exports.getDrugsToForm = async (req, res) => {
  try {
    const [drugs] = await db.query('SELECT drug_id, drug_name, exp_date, quantity FROM drugs WHERE quantity > 0 ORDER BY drug_name, exp_date ASC');
    res.status(200).json(drugs);
  } catch (error) {
    console.error('Error fetching drugs:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Retrieve prescriptions by pet_id
exports.getPrescriptionsByPetId = async (req, res) => {
  const { pet_id } = req.params;

  try {
    const [prescriptions] = await db.query(
      'SELECT pres_id, drug_name, dosage, presdate, des, first_name FROM prescription WHERE pet_id = ? ORDER BY presdate DESC',
      [pet_id]
    );

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error retrieving prescriptions by pet_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// // Middleware to check if user is a doctor
// exports.isDoctor = (req, res, next) => {
//   if (req.session.userRole !== 'doctor') {
//     return res.status(403).json({ error: 'Access denied' });
//   }
//   next();
// };


// Add multiple prescriptions
exports.addPrescriptions = async (req, res) => {
  const { prescriptions, doc_id, pet_id } = req.body;

  if (!prescriptions || !Array.isArray(prescriptions) || prescriptions.length === 0) {
    return res.status(400).json({ error: 'No prescriptions provided' });
  }

  if (!doc_id || !pet_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Validate all drugs exist
    const drugIds = prescriptions.map(p => p.drug_id);
    const [drugs] = await db.query('SELECT drug_id, drug_name, quantity FROM drugs WHERE drug_id IN (?)', [drugIds]);

    const drugMap = new Map(drugs.map(d => [d.drug_id, { drug_name: d.drug_name, quantity: d.quantity }]));

    // Check if all provided drug_ids are valid
    const invalidDrugIds = drugIds.filter(id => !drugMap.has(id));
    if (invalidDrugIds.length > 0) {
      return res.status(404).json({ error: 'Some drugs not found', invalidDrugIds });
    }

    // Get the doctor's first name using doc_id
    const [doctor] = await db.query('SELECT first_name FROM doctors WHERE d_id = ?', [doc_id]);
    if (doctor.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    const first_name = doctor[0].first_name;

    // Get a new pres_id for this batch of prescriptions
    const [result] = await db.query('SELECT MAX(pres_id) AS max_pres_id FROM prescription');
    const newPresId = (result[0].max_pres_id || 0) + 1;

    // Insert all prescriptions with the same pres_id
    for (const pres of prescriptions) {
      const { drug_id, dosage, presdate, des } = pres;
      const drugInfo = drugMap.get(drug_id);
      const { drug_name, quantity } = drugInfo;

      // Check if there is enough quantity available
      if (quantity < dosage) {
        console.log(`Insufficient quantity for drug ${drug_name}. Available: ${quantity}, Required: ${dosage}`);
        return res.status(400).json({ error: `Insufficient quantity for drug ${drug_name}`, availableQuantity: quantity });
      }

      await db.query(
        'INSERT INTO prescription (pres_id, drug_id, drug_name, dosage, presdate, des, doc_id, first_name, pet_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newPresId, drug_id, drug_name, dosage, presdate, des, doc_id, first_name, pet_id]
      );

      // Update the quantity in the drugs table
      const newQuantity = quantity - dosage;
      if (newQuantity > 0) {
        console.log(`Updating quantity for drug ${drug_name}. New quantity: ${newQuantity}`);
        await db.query('UPDATE drugs SET quantity = ? WHERE drug_id = ?', [newQuantity, drug_id]);
      } else {
        // Set the quantity to 0 instead of deleting the drug
        console.log(`Setting quantity of drug ${drug_name} to 0 as quantity is now 0`);
        await db.query('UPDATE drugs SET quantity = 0 WHERE drug_id = ?', [drug_id]);
      }
    }

    res.status(201).json({ message: 'Prescriptions added successfully', pres_id: newPresId });
  } catch (error) {
    console.error('Error adding prescriptions:', error);
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};



// Delete a prescription record
exports.deletePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM prescription WHERE pres_id = ?', [id]);
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Controller function to fetch prescription records by prescription ID
exports.getPrescriptionRecords = async (req, res) => {
  try {
    const { pres_id } = req.params;

    // Fetch prescription records from the database
    const [prescriptions] = await db.query(
      'SELECT drug_id, drug_name, dosage AS quantity FROM prescription WHERE pres_id = ?',
      [pres_id]
    );

    // Check if the prescriptions array is empty
    if (prescriptions.length === 0) {
      return res.status(404).json({ message: 'Prescription records not found' });
    }

    // Return the fetched prescription records
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescription records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};