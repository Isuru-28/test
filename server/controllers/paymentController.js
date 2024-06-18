const db = require('../db');

// Controller function to calculate bill for unregistered pets
exports.calculateBill = async (req, res) => {
    try {
      const { drugs } = req.body;
  
      // Calculate total amount based on drugs and dosages
      let totalAmount = 0;
      for (const drug of drugs) {
        const [result] = await db.query('SELECT unit_price FROM drugs WHERE drug_id = ?', [drug.drug_id]);
        const unit_price = result[0]?.unit_price; // Use optional chaining to handle undefined unit_price
        if (unit_price !== undefined) {
          totalAmount += unit_price * drug.quantity;
        } else {
          console.error(`Unit price for drug with ID ${drug.drug_id} is undefined.`);
          // For non-existent drug IDs, assume unit price is 0
          totalAmount += 0;
        }
      }
  
      res.json({ totalAmount });
    } catch (error) {
      console.error('Error calculating bill:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

exports.savePayment = async (req, res) => {
  try {
    const { pet_id, pres_id, receptionist_id, total_amount, pet_name, drugs, first_name } = req.body;

    // Validate required fields
    if (!receptionist_id || !total_amount) {
      return res.status(400).json({ message: 'Receptionist ID and total amount are required.' });
    }

    if (pet_id && pres_id) {
      // Check for existing payment with the same prescription ID
      const checkSql = 'SELECT * FROM payments WHERE pres_id = ?';
      const [existingPayment] = await db.query(checkSql, [pres_id]);

      if (existingPayment.length > 0) {
        return res.status(400).json({ message: 'A payment has already been made for this prescription.' });
      }

      // Insert payment for a registered pet
      const sql = 'INSERT INTO payments (pet_id, pres_id, receptionist_id, total_amount, pet_name, first_name) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [pet_id, pres_id, receptionist_id, total_amount, pet_name, first_name];
      await db.query(sql, values);
    } else {
      // Insert payment for an unregistered pet
      const sql = 'INSERT INTO payments (receptionist_id, total_amount, pet_name, first_name) VALUES (?, ?, ?, ?)';
      const values = [receptionist_id, total_amount, pet_name, first_name];
      await db.query(sql, values);

      // Deduct drug quantities from the drugs table
      for (const drug of drugs) {
        const { drug_id, quantity } = drug;

        // Fetch the current quantity from the drugs table
        const [drugData] = await db.query('SELECT quantity FROM drugs WHERE drug_id = ?', [drug_id]);
        if (drugData.length === 0) {
          console.error(`Drug with ID ${drug_id} not found.`);
          continue;
        }

        const currentQuantity = drugData[0].quantity;
        const newQuantity = currentQuantity - quantity;

        if (newQuantity >= 0) {
          console.log(`Updating quantity for drug ID ${drug_id}. New quantity: ${newQuantity}`);
          await db.query('UPDATE drugs SET quantity = ?, updated_date = CURRENT_TIMESTAMP WHERE drug_id = ?', [newQuantity, drug_id]);
        } else {
          // If the quantity is negative, set it to 0
          console.log(`Setting quantity of drug ID ${drug_id} to 0 as quantity is now less than 0`);
          await db.query('UPDATE drugs SET quantity = 0, updated_date = CURRENT_TIMESTAMP WHERE drug_id = ?', [drug_id]);
        }
      }
    }

    // Respond with a success message
    res.json({ message: 'Payment saved successfully' });
  } catch (error) {
    // Log the error and respond with a server error message
    console.error('Error saving payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to fetch all payment records
exports.getAllPayments = async (req, res) => {
    try {
      // SQL query to fetch payment records, sorting by payment_date in descending order
      const query = `
        SELECT 
          bill_id AS bill_id, 
          first_name, 
          pet_name, 
          pres_id, 
          payment_date, 
          total_amount
        FROM 
          payments
        ORDER BY 
          payment_date DESC;
      `;
  
      // Execute the query
      const [rows] = await db.query(query);
  
      // Send the retrieved data as a response
      res.json(rows);
    } catch (error) {
      console.error('Error fetching payment records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to delete a payment record
exports.deletePayment = async (req, res) => {
    const { id } = req.params; // Get the payment ID from the URL parameters
  
    try {
      // Check if the payment record exists
      const [payment] = await db.query('SELECT * FROM payments WHERE bill_id = ?', [id]);
      if (payment.length === 0) {
        return res.status(404).json({ message: 'Payment record not found' });
      }
  
      // Delete the payment record
      await db.query('DELETE FROM payments WHERE bill_id = ?', [id]);
  
      res.json({ message: 'Payment record deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };  

// Fetch payments for a specific pet
exports.getPaymentsByPetId = async (req, res) => {
    const { pet_id } = req.params;
  
    try {
      const [payments] = await db.query(`
        SELECT 
          bill_id,
          first_name,
          pet_name,
          pres_id,
          payment_date,
          total_amount
        FROM 
          payments
        WHERE 
          pet_id = ?
        ORDER BY 
          payment_date DESC;`, 
        [pet_id]
      );
  
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };  


// Get today's earnings
exports.getTodayEarnings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT SUM(total_amount) AS todayEarnings 
      FROM payments 
      WHERE DATE(payment_date) = CURRENT_DATE;
    `);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching today\'s earnings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current month's earnings
exports.getMonthEarnings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT SUM(total_amount) AS monthEarnings 
      FROM payments 
      WHERE MONTH(payment_date) = MONTH(CURRENT_DATE) 
        AND YEAR(payment_date) = YEAR(CURRENT_DATE);
    `);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching month\'s earnings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};  

//get yesterday's earnings
exports.getEarningsYesterday = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Get the date of yesterday
    const [result] = await db.query(`
      SELECT SUM(total_amount) AS yesterdayEarnings
      FROM payments
      WHERE DATE(payment_date) = DATE(?)
    `, [yesterday]);

    const { yesterdayEarnings } = result[0];
    res.json({ yesterdayEarnings });
  } catch (error) {
    console.error('Error fetching yesterday\'s earnings:', error);
    res.status(500).json({ error: 'An error occurred while fetching yesterday\'s earnings' });
  }
};

// Function to fetch payments by month and year
exports.getPaymentsByMonthYear = async (req, res) => {
  const { month, year } = req.query;

  try {
    // Ensure month and year are provided
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required parameters' });
    }

    // Convert month and year to integers
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    // Validate month and year values
    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ error: 'Invalid month or year format' });
    }

    // Construct the SQL query to fetch payments
    const query = `
      SELECT *
      FROM payments
      WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?
    `;
    
    // Execute the query with the month and year parameters
    const [results] = await db.query(query, [monthInt, yearInt]);

    // Return the results as JSON response
    res.json(results);
  } catch (error) {
    console.error('Error fetching payments by month and year:', error);
    res.status(500).json({ error: 'An error occurred while fetching payments' });
  }
};




// Function to fetch total income of the previous and next months
exports.getTotalPreviousNextMonthIncome = async (req, res) => {
  const { month, year } = req.query;

  try {
    // Ensure month and year are provided
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required parameters' });
    }

    // Convert month and year to integers
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    // Validate month and year values
    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ error: 'Invalid month or year format' });
    }

    // Calculate previous month
    const prevMonth = monthInt === 1 ? 12 : monthInt - 1;
    const prevYear = monthInt === 1 ? yearInt - 1 : yearInt;

    // Calculate next month
    const nextMonth = monthInt === 12 ? 1 : monthInt + 1;
    const nextYear = monthInt === 12 ? yearInt + 1 : yearInt;

    // Fetch total income of the previous month
    const totalPreviousMonthIncome = await fetchTotalMonthIncome(prevMonth, prevYear);

    // Fetch total income of the next month
    const totalNextMonthIncome = await fetchTotalMonthIncome(nextMonth, nextYear);

    // Return the results as JSON response
    res.json({
      totalPreviousMonthIncome,
      totalNextMonthIncome
    });
  } catch (error) {
    console.error('Error fetching total previous and next month income:', error);
    res.status(500).json({ error: 'An error occurred while fetching incomes' });
  }
};

// Function to fetch total income for a specific month and year
const fetchTotalMonthIncome = async (month, year) => {
  try {
    // Construct the SQL query to fetch total income
    const query = `
      SELECT SUM(total_amount) AS totalMonthIncome
      FROM payments
      WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?
    `;
    
    // Execute the query with the month and year parameters
    const [result] = await db.query(query, [month, year]);

    // Return the sum of total_amount or 0 if no records found
    return result[0]?.totalMonthIncome || 0;
  } catch (error) {
    console.error(`Error fetching total income for month ${month}, year ${year}:`, error);
    return 0;
  }
};
