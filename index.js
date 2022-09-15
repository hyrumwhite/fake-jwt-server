const express = require("express");
const cookieParser = require("cookie-parser");
const encode = require("jwt-encode");
const crypto = require("crypto");
const arguments = require("./arguments.js");
const {
	port = 3535,
	sessionLength = 30,
	jwtLength = 15,
	redirectURL = "http://localhost:3000",
} = arguments;
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
setInterval(refreshJWT, 1000 * 60 * jwtLength);
app.use((req, res, next) => {
	let origin = req.headers?.referer?.slice(0, -1) || "http://localhost:3000";
	res.header("Access-Control-Allow-Origin", origin);
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
	let expires = Date.now() + 1000 * 60 * sessionLength;
	res.cookie("fake-session", "fake-value", {
		expires: new Date(expires),
	});
	res.redirect(redirectURL);
});

app.use((req, res, next) => {
	if (req.method != "OPTIONS") {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.includes(jwt)
		) {
			return res.status(401).send("Unauthorized");
		}
		let expires = Date.now() + 1000 * 60 * sessionLength;
		res.cookie("fake-session", "fake-value", {
			expires: new Date(expires),
		});
	}
	next();
});

app.get("/protected-data", (req, res) => {
	res.send({ name: "john doe", id: crypto.randomUUID() });
});

app.get("/permissions", (req, res) => {
	res.send({ can_get_data: true });
});

app.listen(port);

console.info(`Server running at http://localhost:${port}`);
console.info(`Login will redirect to ${redirectURL}`);
console.info(`Login session will last ${sessionLength} minutes`);
console.info(`JWT will last ${jwtLength} minutes`);
