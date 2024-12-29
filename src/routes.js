const express = require('express');
const multer = require('multer');
const Agreement = require('./models/agreementModel');

const router = express.Router();
const upload = multer();

router.post('/agreements', upload.single('pdfFile'), async (req, res) => {
    try {
        const { companyName, agreementName } = req.body;
        const pdfFile = req.file.buffer;

        const agreement = new Agreement({
            companyName,
            agreementName,
            pdfFile
        });

        await agreement.save();
        res.status(201).json({ message: 'Agreement saved successfully' });
    } catch (error) {
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