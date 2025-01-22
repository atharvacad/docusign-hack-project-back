const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const versionSchema = new mongoose.Schema({
    fileData: {
        type: Buffer,
        required: true
    },
    aiOutput: {
        type: String,
        required: false
    },
    aiInsight: {
        type: String,
        required: false
    },
    versionNumber: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        required: true
    },
    esignSent: {
        type: Boolean,
        default: false
    }
});

const agreementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    agreementName: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    versions: [versionSchema]
});

const Agreement = mongoose.model('Agreement', agreementSchema, process.env.COLLECTION_NAME);

module.exports = Agreement;