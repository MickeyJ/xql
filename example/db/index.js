const { Pool } = require('../../');
const Cache = require('./Cache');
const queries = require('./queries');

const cache = new Cache();

const pool = new Pool({
    host     : process.env.LOCAL_HOST,
    user     : process.env.LOCAL_DB_USER,
    password : process.env.LOCAL_DB_PASSWORD,
    database : 'testing',
    multipleStatements: true,
    dateStrings: true,
}, cache);


module.exports = {
    pool,
    queries: queries(pool),
};
