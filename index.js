const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const knex = require("./db/client");
const methodOverride = require("method-override");
const { name } = require("ejs");
// const router = express.Router();

const app = express();

app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Middleware to override HTTP verb
app.use(
	methodOverride((request, response) => {
		if (request.body && request.body._method) {
			const method = request.body._method;

			// Delete method off of "request.body" because we won't be using it after overriding.
			delete request.body._method;

			// Whatever is returned from this callback will be the new HTTP verb for the request.
			return method;
		}
	})
);

app.get("/", (req, res) => {
	res.render("homepage");
});

app.get("/new", (req, res) => {
	res.render("new");
});

app.post("/new", (req, res) => {
	const { logoUrl, name, members } = req.body || "undefined";
	knex("cohorts")
		.insert(
			{
				logoUrl,
				name,
				members,
			},
			"*"
		)
		.then((data) => {
			console.table(data);
			res.render("show", { data });
		});
});
app.get("/cohorts", (request, response) => {
	knex
		.select("*")
		.from("cohorts")
		.then((data) => {
			// array of objects
			console.log(data);
			// change show to index.ejs and list all cohorts in database
			response.render("index", { cohorts: data });
		});
});

app.get("/cohorts/:id", (req, res) => {
	let id = req.params.id;
	let method = req.query.method;
	console.log(method);
	let quantity = req.query.quantity;
	console.log(quantity);
	// logic for making teams

	// logic for making teams

	knex
		.select("*")
		.from("cohorts")
		.where("id", id)
		.then((data) => {
			if (method === teamCount) {
			} else if (method === numberTeam) {
			}

			if (data.length === 0) {
				res.send(`<h1> cannot find article with this id </h1>`);
			} else {
				console.log(data);
				res.render("show", { data });
			}
		});
});

const PORT = process.env.PORT || 3000;
const ADDRESS = "localhost";

app.listen(PORT, ADDRESS, () => {
	console.log(`Server listenning on http://${ADDRESS}:${PORT}`);
});
