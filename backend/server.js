const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Adjust the path as needed
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
