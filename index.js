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

app.post("/cohorts", (req, res) => {
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
		.then((cohorts) => {
			console.table(cohorts[0]);

			let cohort = cohorts[0];
			let cohortsId = cohorts[0].id;
			res.redirect(`/cohorts/${cohortsId}`);
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
	let id = req.params.id; // team id
	let method = req.query.method; // which method they use
	let quantity = req.query.quantity; // how many people in each team
	console.log(quantity, method, id);

	// logic for making teams
	knex
		.select("*")
		.from("cohorts")
		.where("id", id)
		.first()
		.then((cohort) => {
			if (cohort && !method && !quantity) {
				res.render("show", { cohort, teams: null });
			} else if (method && quantity && cohort) {
				// Shuffle function
				function shuffle(arr) {
					let ctr = arr.length,
						temp,
						index;

					// While there are elements in the array
					while (ctr > 0) {
						// Pick a random index
						index = Math.floor(Math.random() * ctr);
						// Decrease ctr by 1
						ctr--;
						// And swap the last element with it
						temp = arr[ctr];
						arr[ctr] = arr[index];
						arr[index] = temp;
					}
					return arr;
				}

				if (method === "numberTeam") {
					// console.log(method, quantity, cohort.name, cohort.members);

					let membersArr = cohort.members.split(",");

					// console.log(shuffle(membersArr));
					shuffle(membersArr);
					let n = Number(quantity);

					// Split teams by teamCount number
					let remainingMembers = membersArr.length % n;

					const teams = new Array(Math.ceil(membersArr.length / 2))
						.fill()
						.map((_) => membersArr.splice(0, n));
					console.log(teams);

					res.render("show", { cohort, teams });
					// TeamCount
				} else if (method === "teamCount") {
					console.log(method, quantity, cohort.name, cohort.members);
					let membersArr = [];
					membersArr = cohort.members.split(",");

					// Shuffle function
					function shuffle(arr) {
						let ctr = arr.length,
							temp,
							index;

						// While there are elements in the array
						while (ctr > 0) {
							// Pick a random index
							index = Math.floor(Math.random() * ctr);
							// Decrease ctr by 1
							ctr--;
							// And swap the last element with it
							temp = arr[ctr];
							arr[ctr] = arr[index];
							arr[index] = temp;
						}
						return arr;
					}
					shuffle(membersArr);
					// console.log(membersArr);

					let n = Number(quantity);

					const teams = [];
					for (let i = 0; i < n; i++) {
						teams.push([]);
					}
					let teamIndex = 0;
					while (membersArr.length) {
						teams[teamIndex].push(membersArr.pop());
						if (teamIndex === n - 1) {
							teamIndex = 0;
						} else {
							teamIndex++;
						}
					}
					console.log(teams);

					res.render("show", { cohort, teams });
				}
			} else {
				res.send(
					`<h1> Please select a method and quantity to generate teams</h1>`
				);
			}
		});
});

// app.post("/cohorts/:id", (req, res) => {
// 	// This route handles a post request instead of a GET.
// 	// Only with GET requests is the form data available in the query string | e.g 'request.query.etc'
// 	// With a post request, we access the data from 'request.body' || res.body
// 	// which is only availble if the 'urlendcoded'
// 	// middleware is used
// 	const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // number of milliseconds * min * hour * day
// 	const { quantity, method } = req.body;
// 	res.cookie("quantity", quantity, "method", method, {
// 		maxAge: COOKIE_MAX_AGE,
// 	});
// 	res.redirect("/cohorts/:id");

// 	// 'response.cookie' is available to use if 'cookie-parse' middleware is setup
// 	// we use it to send back cookies to the client. The arguments are:
// 	// response.cookie(<name-of-cookie> , <value-of-cookie> , <options> )
// 	// The 'maxAge' property of options sets the age of the cookie.
// 	// The time starts form when the cookie was set. Plus the number of milliseconds for the age
// 	// until expiration
// });

// Delete cohort
app.delete("/cohorts/:id", (request, response) => {
	const id = request.params.id;

	knex("cohorts")
		.where("id", id)
		.del()
		.then(() => {
			console.log(`Deleted article with id: ${id}`);
			response.redirect("/cohorts");
		});
});
//edit cohort
app.get("/cohorts/:id/edit", (request, response) => {
	const id = request.params.id;
	knex("cohorts")
		.where("id", id)
		.first()
		.then((cohort) => {
			if (cohort) {
				response.render("edit", { cohort });
			}
		});
});
app.patch("/cohorts/:id", (request, response) => {
	const id = request.params.id;
	const { logoUrl, name, members } = request.body;

	knex("cohorts")
		.where("id", id)
		.update({
			logoUrl,
			name,
			members,
		})
		.then(() => response.redirect(`/cohorts/${id}`));
});

const PORT = process.env.PORT || 3000;
const ADDRESS = "localhost";

app.listen(PORT, ADDRESS, () => {
	console.log(`Server listenning on http://${ADDRESS}:${PORT}`);
});
