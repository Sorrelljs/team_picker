
exports.up = function(knex) {
    return knex.schema.createTable("cohorts", table => {
        table.bigIncrements("id") 
        table.string("name")
        table.string("logoUrl")
        table.text("members") 
        
      })
  
};



exports.down = function(knex) {
    return knex.schema.dropTable("cohorts") // DROP TABLE posts;
  
};
