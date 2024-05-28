const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors')

// Database connection
mongoose.connect('mongodb://localhost:27017/training_platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('Error: ' + err));

app.use(cors())

app.use(bodyParser.json());


// Import routes
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');

app.use('/courses', courseRoutes);

app.use('/students', studentRoutes);

app.use('/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));