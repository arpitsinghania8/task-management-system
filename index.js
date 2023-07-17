const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./src/routes/tasks');
const userRoutes = require('./src/routes/user');
const { swaggerUi, swaggerSpecs } = require('./swagger');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/task_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.json());

// Use the user routes for '/users' endpoints
app.use('/users', userRoutes);

// Use the task routes for '/tasks' endpoints
app.use('/tasks', taskRoutes);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Invalid route' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;