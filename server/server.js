const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const rootRouter = require('./routes/root.routes');

const app = express();
const port = 3001;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(
    '/assets/',
    (req, res, next) => {
        try {
            if (fs.existsSync('./public' + req.path)) {
                next();
            }
        } catch (e) {
            console.log(e);
            return;
        }
    },
    express.static('public', {
        etag: true,
        maxAge: '365d'
    })
);

app.use('/', rootRouter);


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
