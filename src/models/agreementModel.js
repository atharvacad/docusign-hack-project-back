const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const agreementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    agreementName: {
        type: String,
        required: true
    },
    pdfFile: {
        type: Buffer,
        required: true
    }
});

const Agreement = mongoose.model('Agreement', agreementSchema, process.env.COLLECTION_NAME);

module.exports = Agreement;