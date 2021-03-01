// Load the config of knexfile.js
const knexfile = require("../knexfile")

const knexConnector = require("knex")
// The knexConnctor is a function that creates a client for us
// We pass in the configuration (development) as an arugment
const knex = knexConnector(knexfile.development)

// Export the client
// Anywhere we make queries to our db using knex, we'll need to import this client
module.exports = knex