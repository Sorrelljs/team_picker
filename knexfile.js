module.exports = {

  development: {
    // The "client" setting corresponds to the library used to connect to our db
    client: 'pg',
    connection: {
      database: 'team_cohorts', // Name of your database

      // Linux requires the user and password
      // If you dont have a password for your user you'll need to create one:
      // $ psql
      // my_user=# \password
      
      // username: "al",
      // password: "supersecret",
    },
    migrations: {
      // Migrations are queries to build the schema of our database
      // e.g. creating tables, altering tables, deleting tables
      tableName: "migrations",
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    }
  },

};