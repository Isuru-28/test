const db = require('../db'); // Ensure you have your database connection here

const WORKING_HOURS_START = 15; // 3 PM
const WORKING_HOURS_END = 21; // 9 PM
const SLOT_DURATION = 20; // 20 minutes

const generateTimeSlots = (date) => {
  const slots = [];
  const startTime = new Date(date);
  startTime.setHours(WORKING_HOURS_START, 0, 0, 0);

  for (let i = 0; i < (WORKING_HOURS_END - WORKING_HOURS_START) * 60 / SLOT_DURATION; i++) {
    const endTime = new Date(startTime.getTime() + SLOT_DURATION * 60000);
    slots.push({
      start: startTime.toTimeString().substr(0, 5), // "HH:MM" format
      end: endTime.toTimeString().substr(0, 5), // "HH:MM" format
      state: 'available'
    });
    startTime.setTime(endTime.getTime());
  }

  return slots;
};

//book an appointment
exports.bookAppointment = async (req, res) => {
  const { pet_id, appdate, timeslot, createdby, user_id } = req.body;

  try {
    const query = `
      INSERT INTO appointments (pet_id, appdate, timeslot, state, createdby, user_id)
      VALUES (?, ?, ?, 'pending', ?, ?);
    `;
    await db.query(query, [pet_id, appdate, `${timeslot}:00`, createdby, user_id]);
    res.status(201).json({ message: 'Appointment request sent successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//appointment accepting
exports.acceptAppointment = async (req, res) => {
  const { appid } = req.params;
  const { user_id } = req.body; // Extract user_id from request body

  // Log the received user_id
  console.log('Received user_id:', user_id);

  // Check if user_id is present
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Retrieve appointment details
    const [appointmentRows] = await db.query(
      'SELECT appdate, timeslot, pet_id FROM appointments WHERE appid = ?',
      [appid]
    );

    if (appointmentRows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { appdate, timeslot, pet_id } = appointmentRows[0];

    // Update the appointment state to 'booked'
    const updateQuery = `
      UPDATE appointments
      SET state = 'booked'
      WHERE appid = ?;
    `;
    await db.query(updateQuery, [appid]);

    // Create a notification
    const notificationQuery = `
      INSERT INTO notifications (pet_id, message, user_id)
      VALUES (?, ?, ?);
    `;
    const message = `Your appointment on ${new Date(appdate).toDateString()} at ${timeslot} has been booked`;
    await db.query(notificationQuery, [pet_id, message, user_id]);

    res.status(200).json({ message: 'Appointment accepted and notification created successfully' });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// //appointment rejecting
// exports.rejectAppointment = async (req, res) => {
//   const { appid } = req.params;
//   try {
//     // Log the appid being processed
//     console.log(`Rejecting appointment with appid: ${appid}`);
    
//     // Update appointment state to 'rejected'
//     const [result] = await db.query(`
//       UPDATE appointments
//       SET state = 'rejected', timeslot = SUBTIME(timeslot, '12:00:00')
//       WHERE appid = ?;
//     `, [appid ]);
    
//     // Check if any rows were affected
//     if (result.affectedRows === 0) {
//       console.warn(`No appointment found with appid: ${appid}`);
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     res.status(200).json({ message: 'Appointment rejected successfully' });
//   } catch (error) {
//     console.error('Error rejecting appointment:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// Get available slots for a specific date
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.params;
  const slots = generateTimeSlots(date);

  try {
    const query = `
      SELECT timeslot, state 
      FROM appointments 
      WHERE appdate = ?;
    `;
    const [rows] = await db.query(query, [date]);

    // Update slots based on booked/unavailable slots from the database
    rows.forEach(row => {
      const dbTimeslot = row.timeslot.substr(0, 5); // Convert "HH:MM:SS" to "HH:MM"
      const slot = slots.find(slot => slot.start === dbTimeslot);
      if (slot) {
        slot.state = row.state;
      }
    });

    res.status(200).json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Edit an appointment (by admin or receptionist)
exports.editAppointment = async (req, res) => {
  const { appid } = req.params;
  const { state, user_id } = req.body;

  try {
    const updateQuery = `
      UPDATE appointments
      SET state = ?, user_id = ?
      WHERE appid = ?;
    `;
    await db.query(updateQuery, [state, user_id, appid]);

    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch appointments for a specific user
exports.getAppointmentsByUserId = async (req, res) => {
    const { user_Id } = req.params;
  
    try {
      const [appointments] = await db.query(`
        SELECT 
          a.appid, 
          p.pet_name, 
          p.first_name, 
          a.appdate, 
          a.timeslot, 
          a.state 
        FROM 
          appointments a
        JOIN 
          pets p ON a.pet_id = p.p_id
        WHERE 
          a.pet_id = ?
        ORDER BY 
          a.appdate DESC`, 
        [user_Id]
      );
  
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


// Fetch all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT 
        a.appid, 
        p.pet_name, 
        p.first_name, 
        a.appdate, 
        a.timeslot, 
        a.state 
      FROM 
        appointments a
      JOIN 
        pets p ON a.pet_id = p.p_id
      ORDER BY 
        a.appdate DESC
    `);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// // Mark a time slot as unavailable
// exports.markUnavailable = async (req, res) => {
//   const { appdate, timeslot } = req.body;
//   try {
//     const query = `
//       INSERT INTO appointments (appdate, timeslot, state)
//       VALUES (?, ?, 'unavailable')
//       ON DUPLICATE KEY UPDATE state = 'unavailable';
//     `;
//     await db.query(query, [appdate, timeslot]);
//     res.status(200).json({ message: 'Time slot marked as unavailable successfully' });
//   } catch (error) {
//     console.error('Error marking time slot as unavailable:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.markUnavailable = async (req, res) => {
  const { slots } = req.body;
  try {
    const queries = slots.map((slot) => db.query(
      `
      INSERT INTO appointments (appdate, timeslot, state, createdby, user_id)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE state = VALUES(state)
      `, [slot.appdate, slot.timeslot, 'unavailable', slot.createdby, slot.user_id]
    ));

    await Promise.all(queries);

    res.status(200).json({ message: 'Time slots marked as unavailable successfully!' });
  } catch (error) {
    console.error('Error marking unavailable:', error);
    res.status(500).json({ message: 'Failed to mark time slots as unavailable. Please try again.' });
  }
};


exports.markAvailable = async (req, res) => {
  const { slots } = req.body;
  try {
    if (!slots || slots.length === 0) {
      return res.status(400).json({ message: 'No slots provided' });
    }

    const queries = slots.map((slot) => {
      if (!slot.appdate || !slot.timeslot) {
        throw new Error('Invalid slot data');
      }

      return db.query(
        `
        DELETE FROM appointments 
        WHERE appdate = ? AND timeslot = ? AND (state = 'unavailable' OR state = 'booked')
        `, [slot.appdate, slot.timeslot]
      );
    });

    await Promise.all(queries);

    res.status(200).json({ message: 'Time slots marked as available successfully!' });
  } catch (error) {
    console.error('Error marking available:', error);
    res.status(500).json({ message: `Failed to mark time slots as available. Error: ${error.message}` });
  }
};

//appointment complete
exports.completeAppointment = async (req, res) => {
  const { appid } = req.params;

  try {
    const updateQuery = `
      UPDATE appointments
      SET state = 'completed'
      WHERE appid = ?;
    `;
    await db.query(updateQuery, [appid]);

    res.status(200).json({ message: 'Appointment completed successfully' });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get todays appointments
exports.getAppointmentsToday = async (req, res) => {
  try {
    const [appointmentsToday] = await db.query(`
      SELECT pet_name, appdate, timeslot 
      FROM appointments 
      JOIN pets ON appointments.pet_id = pets.p_id 
      WHERE appdate = CURRENT_DATE
      ORDER BY timeslot ASC;
    `);

    res.json(appointmentsToday);
  } catch (error) {
    console.error('Error fetching appointments for today:', error);
    res.status(500).json({ error: 'An error occurred while fetching appointments for today' });
  }
};