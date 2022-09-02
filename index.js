const express = require("express");
const cookieParser = require("cookie-parser");
const encode = require("jwt-encode");
const crypto = require("crypto");
const app = express();
app.use(cookieParser());
// app.use(cors());
let jwt = "";
let userID = crypto.randomUUID();
const refreshJWT = () => {
	jwt = encode(
		{
			name: "John Doesn't",
			uuid: userID,
			timestamp: Date.now(),
		},
		""
	);
};
refreshJWT();
setInterval(refreshJWT, 1000 * 60 * 15);
app.use((req, res, next) => {
	res.header(
		"Access-Control-Allow-Origin",
		req.headers?.referer?.slice(0, -1) || "http://localhost:3000"
	);
	res.header("Access-Control-Allow-Credentials", true);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});
app.get("/jwt", (req, res) => {
	if (!req.cookies["fake-session"]) {
		return res.sendStatus(401);
	}
	res.header("content-type", "text/plain");
	res.send(jwt);
});

app.get("/login", (req, res) => {
	res.header("content-type", "text/html");
	res.send(/*html*/ `
		<form action="/login" method="POST">
			<input type="submit" value="login">
		</form>
	`);
});

app.post("/login", (req, res) => {
	let date = new Date();
	date.setMinutes(date.getMinutes() + 5);
	let expires = Date.now() + 1000 * 60 * 5;
	res.cookie("fake-session", "fake-value", {
		expires: new Date(expires),
	});
	res.redirect("http://localhost:3000");
});

app.use((req, res, next) => {
	let date = new Date();
	date.setMinutes(date.getMinutes() + 5);
	let expires = Date.now() + 1000 * 60 * 5;
	res.cookie("fake-session", "fake-value", {
		expires: new Date(expires),
	});
	next();
});

app.get("/protected-data", (req, res) => {
	if (!req.headers.authorization || !req.headers.authorization.includes(jwt)) {
		return res.status(401).send("Unauthorized");
	}
	res.send({ name: crypto.randomUUID(), id: 1 });
});

app.get("/permissions", (req, res) => {
	if (!req.headers.authorization || !req.headers.authorization.includes(jwt)) {
		return res.status(401).send("Unauthorized");
	}
	res.send({ can_get_data: true });
});

app.listen(3535);
