require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const logger = require('./utils/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const compression = require('compression');
const helmet = require('helmet');
const ipRestriction = require('./middleware/ipRestriction');
const multer = require('multer');
const upload = multer(); 
const app = express();

app.use(upload.none()); 

app.use(compression());
app.use(helmet());

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(ipRestriction);

app.use('/api/v1/users', userRoutes);

app.get('/health', async (req, res) => {
  let dbStatus = 'failed';
  let dbMessage = 'Unable to connect to the database.';
  
  try {
    await sequelize.authenticate();
    dbStatus = 'success';
    dbMessage = 'Database connection established successfully.';
  } catch (error) {
    dbStatus = 'failed';
    dbMessage = `Database error: ${error.message}`;
  }

  res.status(dbStatus === 'success' ? 200 : 500).json({
    status: 'success',
    serverMessage: 'Server is running correctly.',
    database: {
      status: dbStatus,
      message: dbMessage
    }
  });
});

app.use(notFound);

app.use(errorHandler);

const startServer = async (port) => {
  let currentPort = port;

  const server = app.listen(currentPort, async () => {
    try {
      await sequelize.authenticate();
      console.log(`Server is running on http://localhost:${currentPort}`);
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${currentPort} is already in use. Trying next available port...`);
      startServer(currentPort + 1); // Try the next port
    } else {
      console.error('An unexpected error occurred:', err);
    }
  });
};

const PORT = process.env.PORT || 4037;
startServer(PORT);

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('HTTP server closed. Exiting...');
    process.exit(0);
  });
});
