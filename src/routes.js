const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Agreement = require('./models/agreementModel');
const sendToChatGPT = require('./chatgptService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/agreements', upload.single('pdfFile'), async (req, res) => {
    try {
        const { companyName, agreementName } = req.body;
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

        // Log the parsed PDF text
        //console.log('Parsed PDF Text:', pdfText);

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
        let agreement = await Agreement.findOne({ companyName, agreementName });

        if (!agreement) {
            if (update) {
                return res.status(404).json({ message: 'Agreement not found' });
            }
            // Create a new agreement if it doesn't exist
            agreement = new Agreement({
                companyName,
                agreementName,
                versions: []
            });
        }

        // Add the new version
        const newVersion = {
            pdfData: pdfBuffer,
            aiOutput: aiOutput,
            versionNumber: agreement.versions.length + 1,
            uploadDate: new Date()
        };

        agreement.versions.push(newVersion);

        await agreement.save();
        res.status(201).json({ message: 'Agreement processed successfully', pdfText });
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