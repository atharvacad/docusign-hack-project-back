const express = require('express');
const cors = require('cors'); // Import the cors package
const bodyParser = require('body-parser');
const agreementRoutes = require('./routes/agreementRoutes');
const esignatureRoutes = require('./routes/esignatureRoutes');
const aiInsightRoutes = require('./routes/aiInsightRoutes');
const Agreement = require('./models/agreementModel'); // Import the Agreement model

const router = express.Router();
router.use(cors()); // Enable CORS for all routes

// Body parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Use the new route files
router.use(agreementRoutes);
router.use(esignatureRoutes);
router.use(aiInsightRoutes);

router.get('/all-agreements', async (req, res) => {
    try {
        const agreements = await Agreement.find();
        res.status(200).json(agreements);
        console.log('list of agreements:', agreements); 
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;