
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;


const MONGODB_URI = 'mongodb+srv://user-new-11:saloni123@cluster0.dtxqfit.mongodb.net/candicliData?retryWrites=true&w=majority&appName=Cluster0';


mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
