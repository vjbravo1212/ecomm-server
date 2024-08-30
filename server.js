const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Importing the CORS middleware
const ClothingItem = require('./models/ClothingItem');

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enabling CORS for all origins
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes

app.get('/wake-up', (req, res) => {
  res.json({ message: "Server is awake!" });
});



// Add a new clothing item
app.post('/clothing-items', async (req, res) => {
  const { name, price, image_url } = req.body;

  try {
    const newItem = new ClothingItem({ name, price, image_url });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add clothing item' });
  }
});

// Bulk add clothing items
app.post('/clothing-items/bulk', async (req, res) => {
  const items = req.body;

  try {
    const result = await ClothingItem.insertMany(items);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add clothing items' });
  }
});

// Get all clothing items
app.get('/clothing-items', async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});
// Search clothing items by name
app.get('/clothing-items/search', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery || searchQuery.trim() === '') {
    return res.status(400).json({ error: 'Search query cannot be empty' });
  }

  try {
    const regex = new RegExp(searchQuery.trim(), 'i');
    console.log(`Search Regex: ${regex}`);

    const items = await ClothingItem.find({
      name: { $regex: regex }
    });

    console.log(`Found Items: ${items.length}`); // Log the number of items found

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search for clothing items' });
  }
});






// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
