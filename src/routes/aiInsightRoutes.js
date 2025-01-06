const express = require('express');
const Agreement = require('../models/agreementModel');

const router = express.Router();

router.post('/ai-insight-agreement', async (req, res) => {
    try {
        const { companyName, agreementName, versionNumber } = req.body;

        // Log the input values
        console.log('Received values:', { companyName, agreementName, versionNumber });

        // Fetch the agreement details from the database using the company name and agreement name
        const agreement = await Agreement.findOne({ companyName, agreementName });
        console.log('Agreement found:', agreement);

        if (!agreement) {
            return res.status(404).json({ message: 'Agreement not found' });
        }

        // Find the specific version with the given version number
        const version = agreement.versions.find(v => v.versionNumber === versionNumber);
        console.log('Version found:', version);

        if (!version) {
            return res.status(404).json({ message: 'Version not found' });
        }

        // Log the aiOutput to the console
        console.log('AI Output:', version.aiOutput);

        res.status(200).json({ message: 'AI Output fetched successfully', aiOutput: version.aiOutput });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;