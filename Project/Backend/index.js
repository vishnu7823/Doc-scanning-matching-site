const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./src/Config/db');

dotenv.config();

const routes = require('./src/routes/authRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const creditsRoutes = require('./src/routes/creditRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const cron = require('node-cron');
const { resetDailycredits } = require('./src/Controllers/creditController');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', routes);
app.use('/api/documents', documentRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/admin', adminRoutes);

// Reset credits every midnight
cron.schedule("0 0 * * *", resetDailycredits);

// Default route (just a health check for API)
app.get('/', (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
