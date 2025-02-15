const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, err => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
});
