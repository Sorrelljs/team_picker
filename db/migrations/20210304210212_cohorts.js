exports.up = function (knex) {
	return knex.schema.createTable("cohorts", (table) => {
		table.bigIncrements("id");
		table.text("logoUrl");
		table.string("name");
		table.text("members");
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("cohorts");
};
