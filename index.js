const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

app.get("/jwt", (req, res) => {
  if (!req.cookies["fake-session"]) {
    return res.sendStatus(401);
  }
  res.header("content-type", "text/plain");
  res.send(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
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

app.listen(3535);
