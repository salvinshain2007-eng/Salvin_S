const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Changed to lowercase 'contact'

// Validation helper
const validate = ({ name, age, email, description }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 100) {
    errors.push('Age must be between 10 and 100.');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }

  return errors;
};

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, age, email, description } = req.body;

    const errors = validate({ name, age, email, description });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const newContact = new Contact({
      name: name.trim(),
      age: parseInt(age),
      email: email.trim().toLowerCase(),
      description: description.trim()
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Saved to MongoDB successfully',
      data: savedContact
    });

  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({
      success: false,
      errors: ['Server error. Please try again later.']
    });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({
      success: false,
      errors: ['Server error.']
    });
  }
});

module.exports = router;