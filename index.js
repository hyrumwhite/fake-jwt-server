const express = require("express");
const cookieParser = require("cookie-parser");
const encode = require("jwt-encode");
const crypto = require("crypto");
const app = express();
app.use(cookieParser());

let jwt = "";
let userID = crypto.randomUUID();
const refreshJWT = () => {
	console.log("updated jwt");
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
setInterval(refreshJWT, 30000);

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
	console.log(typeof expires);
	res.cookie("fake-session", "fake-value", {
		expires: new Date(expires),
	});
	res.redirect("http://localhost:3000");
});

app.get("/protected-data", (req, res) => {
	if (!req.headers.authorization || !req.headers.authorization.includes(jwt)) {
		return res.status(401).send("Unauthorized");
	}
	res.send([{ name: "test project", id: 1 }]);
});

app.listen(3535);
