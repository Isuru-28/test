const db = require('../db');

// Get all pets for pet table 1
exports.getPets = async (req, res) => {
    try {
      const [pets] = await db.query(`
        SELECT
          
          pet_name AS petName,
          IFNULL(ROUND(DATEDIFF(NOW(), dob) / 365), '') AS age,
          IFNULL(weight, '') AS weight,
          breed,
          first_name AS ownerName,
          p_id as p_id 
        FROM pets;
      `);
  
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
//to pettable 2
  exports.getPetDetailsById = async (req, res) => {
    const { petId } = req.params;
  
    try {
      const [rows] = await db.query('SELECT * FROM pets WHERE p_id = ?', [petId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pet not found' });
      }

      // Format the date to YYYY-MM-DD
      const pet = rows[0];
      if (pet.dob) {
        pet.dob = pet.dob.toISOString().split('T')[0];
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


// Add a function to get pet details by pet ID
exports.getPetDetailsById = async (req, res) => {
  const { petId } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM pets WHERE p_id = ?', [petId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const pet = rows[0];
    // Format the date to YYYY-MM-DD
    if (pet.dob) {
      pet.dob = pet.dob.toISOString().split('T')[0];
    }

    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//function to update pet details by pet ID
exports.updatePetDetails = async (req, res) => {
  const { petId } = req.params;
  const { pet_name, breed, weight, dob } = req.body;

  if (!pet_name || !breed || !weight || !dob) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'UPDATE pets SET pet_name = ?, breed = ?, weight = ?, dob = ? WHERE p_id = ?',
      [pet_name, breed, weight, dob, petId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json({ message: 'Pet details updated successfully' });
  } catch (error) {
    console.error('Error updating pet details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
  