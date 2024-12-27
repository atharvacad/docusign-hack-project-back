const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

const dbUrl = `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB', error);
});