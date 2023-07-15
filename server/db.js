const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "hs2002",
    host: "localhost",
    port: 5432,
    database: "eemporium"
})

module.exports = pool