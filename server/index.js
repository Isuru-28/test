// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const petRoutes = require('./routes/petRoutes');
const presRoutes = require('./routes/presRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const drugRoutes = require('./routes/drugRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', petRoutes);
app.use('/api', presRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', notificationRoutes);
app.use('/api', paymentRoutes);
app.use('/api', drugRoutes);
app.use('/api', profileRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
