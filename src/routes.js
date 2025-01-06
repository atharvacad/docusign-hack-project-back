const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Agreement = require('./models/agreementModel');
const sendToChatGPT = require('./chatgptService');
const { sendEnvelope } = require('./sendEnvelope'); // Import the sendEnvelope function
const cors = require('cors'); // Import the cors package
const bodyParser = require('body-parser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.use(cors()); // Enable CORS for all routes

// Body parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/agreements', upload.single('pdfFile'), async (req, res) => {
    try {
        const { companyName, agreementName, contactName, contactEmail } = req.body;
        const { update } = req.query;

        // Log the request body and file
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const pdfBuffer = req.file.buffer;

        // Parse the PDF content
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text;

        // Perform regex operations on the PDF text
        const regex = /(?<=4\. Period of Work and Milestones)[\s\S]*?(?=5\. Authorities)/g;
        const matches = pdfText.match(regex);
        console.log('Matches Response:', matches);
        
        let aiOutput = null;
        if (matches) {
            // Send the matched text to ChatGPT
            const chatGPTResponse = await sendToChatGPT(matches[0]);
            console.log('ChatGPT Response:', chatGPTResponse);
            aiOutput = chatGPTResponse;
        }

        // Find the existing agreement
        let agreement = await Agreement.findOne({ companyName, agreementName, contactName, contactEmail });

        if (!agreement) {
            if (update) {
                return res.status(404).json({ message: 'Agreement not found' });
            }
            // Create a new agreement if it doesn't exist
            agreement = new Agreement({
                companyName,
                agreementName,
                contactName,
                contactEmail,
                versions: []
            });
        } else {
            // Check if contact information matches
            if (agreement.contactName !== contactName || agreement.contactEmail !== contactEmail) {
                return res.status(400).json({ message: 'Contact information does not match existing agreement' });
            }
        }

        // Determine the version number
        const versionNumber = agreement.versions.length + 1;

        // Add the new version
        const newVersion = {
            fileData: pdfBuffer, // Store the PDF binary data
            aiOutput: aiOutput,
            versionNumber: versionNumber,
            uploadDate: new Date(),
            esignSent: false // Default to false
        };

        agreement.versions.push(newVersion);

        await agreement.save();
        res.status(201).json({ message: 'Agreement processed successfully', pdfText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

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
        const tempFilePath = path.join(__dirname, 'agreement-file', tempFileName);
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

router.get('/all-agreements', async (req, res) => {
    try {
        const agreements = await Agreement.find();
        res.status(200).json(agreements);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;