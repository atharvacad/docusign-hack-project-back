const express = require('express');
const fs = require('fs');
const path = require('path');
const Agreement = require('../models/agreementModel');
const { sendEnvelope } = require('../sendEnvelope'); // Import the sendEnvelope function

const router = express.Router();

router.post('/esignature', async (req, res) => {
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

        // Create a temporary PDF file from the binary data
        const tempFileName = `${companyName}-${agreementName}-version-${versionNumber}-temp.pdf`;
        const tempFilePath = path.join(__dirname, '../agreement-file', tempFileName);
        fs.writeFileSync(tempFilePath, version.fileData);

        // Prepare the envelope arguments
        const envelopeArgs = {
            signerEmail: agreement.contactEmail,
            signerName: agreement.contactName,
            status: 'sent',
            docFile: tempFilePath // Use the temporary PDF file path
        };

        const args = {
            basePath: process.env.BASE_PATH,
            accessToken: process.env.ACCESS_TOKEN,
            accountId: process.env.ACCOUNT_ID,
            envelopeArgs: envelopeArgs
        };

        // Send the envelope using DocuSign
        const envelopeResponse = await sendEnvelope(args);

        // Update the esignSent field to true
        version.esignSent = true;
        await agreement.save();

        // Delete the temporary PDF file
        fs.unlinkSync(tempFilePath);

        res.status(200).json({ message: 'Envelope sent successfully', envelopeId: envelopeResponse.envelopeId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;