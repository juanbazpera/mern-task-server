const express = require('express');
const dbConnect = require('./config/db');
const cors = require('cors');

// Create server
const app = express();
// Connect db
dbConnect();

// Allow cors
app.use(cors());

// Allow express.json
app.use(express.json({ extended: true }));

// APP port
const port = process.env.PORT || 4000;

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});
