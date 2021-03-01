const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const knex = require("./db/client");
const methodOverride = require("method-override");
// const router = express.Router();

const app = express();

app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.render("homepage");
});

app.get("/new", (req, res) => {
	res.render("new");
});

app.post("/new", (req, res) => {
	const { logoUrl, name, members } = req.body;
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
      res.render("show");
    });
});



const PORT = process.env.PORT || 3000;
const ADDRESS = "localhost";

app.listen(PORT, ADDRESS, () => {
	console.log(`Server listenning on http://${ADDRESS}:${PORT}`);
});
