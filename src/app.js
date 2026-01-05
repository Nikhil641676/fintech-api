require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const routes = require('../routes');
require('../config/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JSON Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            msg: "Invalid or empty JSON body"
        });
    }
    next();
});

app.use(cors());
app.use(express.json());
app.use('/api', routes);

module.exports = app;
