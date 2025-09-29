// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const quoteRoutes = require('./routes/quoteRoutes');
const { initSocket } = require('./socket');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/quotes', quoteRoutes);

const PORT = process.env.PORT || 3306;

// Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO on the server
initSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on 
https://app-f07ade1a-3741-4ab8-8393-c232b850346b.cleverapps.io`);
});
//http://localhost:${PORT}