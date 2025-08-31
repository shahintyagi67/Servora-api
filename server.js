const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/user/auth');
const adminRoutes = require('./routes/admin/auth');
const morgan = require('morgan');
const cors = require('cors');
require('./cron/notification')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors());

app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
