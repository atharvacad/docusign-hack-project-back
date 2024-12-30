const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Agreement = require('./models/agreementModel');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/agreements', upload.single('pdfFile'), async (req, res) => {
    try {
        const { companyName, agreementName } = req.body;

        // Log the request body and file
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        if (!req.file) {
            console.error('No file uploaded');
            // Commenting out the return statement to proceed further
            // return res.status(400).json({ message: 'No file uploaded' });
        }

        let pdfText = '';
        if (req.file) {
            const pdfBuffer = req.file.buffer;

            // Parse the PDF content
            const pdfData = await pdfParse(pdfBuffer);
            pdfText = pdfData.text;

            // Log the parsed PDF text
            console.log('Parsed PDF Text:', pdfText);

            if (pdfText) {
                // Perform regex operations on the PDF text
                const regex = /(?<=4\. Period of Work and Milestones)[\s\S]*?(?=5\. Authorities)/g;
                const matches = pdfText.match(regex);

                if (matches) {
                    // Log or process the matches as needed
                    console.log('Matches found:', matches);
                } else {
                    console.log('No matches found.');
                }
            } else {
                console.log('Failed to parse PDF.');
            }
        }

        const agreement = new Agreement({
            companyName,
            agreementName,
            pdfFile: req.file ? req.file.buffer : null,
            pdfText: pdfText || null
        });

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