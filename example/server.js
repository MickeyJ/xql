const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const api = express();

api.use(morgan('dev'));
api.use(bodyParser.json({limit: '200mb'}) );

api.get('/favicon.ico', function(req, res) {
    res.status(204).send();
});

api.get('/', (req, res, next) => {
    res.redirect('/users')
});

routes(api);

api.use((req, res, next) =>{
    const err = new Error('Not Found');
    err.status = 404;
    console.log(`URL Not Found: '${req.url}'`);
    next(err);
});


api.use((err, req, res, next) =>{
    console.dir(err);
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err,
    });
});

api.listen('3000');
