const knexfile = require("../knexfile"); // requring our knexfile.js

const knexConnector = require("knex"); // requiring knex from npm

module.exports = knexConnector(knexfile.development);
// export the client
// anywhere we make quieries to our db using knex
