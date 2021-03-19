const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const {generateRandomString, checkEmailsEqual, findIDbyEmail, urlsForUser} = require("./helper");


//requires ejs
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

const urlDatabase = {
  "b2xVn2": {longURL: "http://lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://google.com", userID: "aJ48lW"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "otherRandomID": {
    id: "otherRandomID",
    email: "elikaplan@me.com",
    password: "password"
  }
};

app.get("/urls", (req, res)=>{
  const templateVars = {urls: urlDatabase, user: users[req.session.userID], userID: req.session.userID};
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  if (req.session.userID === undefined) { //checks if user is logged in
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] =  {longURL: req.body.longURL, userID: req.session.userID};//pushes a new short URL to the database
  res.redirect(`/urls/${shortURL}`);
});
app.get("/urls/:shortURL",(req, res)=>{
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session.userID]};
  let urlsArray = urlsForUser(req.session.userID, urlDatabase);
  for (const url of urlsArray) { //checks to see if user is logged in, and if the shortURL is associated with their account
    if (req.session.userID === undefined) {
      res.send("You must be logged in to see this URL!");
    }
    if (url === req.params.shortURL) {
      res.render("urls_show", templateVars);
    }
  }
  res.send("This URL belongs to a different user.");
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL; // urlDatabase[shortURL] ??
  res.redirect(longURL);
});
app.get("/login", (req, res)=>{
  const templateVars = {user: users[req.session.userID]};
  res.render("urls_login", templateVars);
});
app.post("/login", (req, res)=>{
  if (!checkEmailsEqual(req.body.email, users)) { //checks to see if email is registered
    res.send(`Error 403. Email or password was incorrect`);
  }
  if (!bcrypt.compareSync(req.body.password, users[findIDbyEmail(req.body.email, users)].password)) { //checks to see if the password is correct
    res.send(`Error 403. Email or password was incorrect`);
  } else {
    req.session.userID = findIDbyEmail(req.body.email, users); //appropriately sets cookies
    res.redirect("/urls");
  }
});
app.post("/urls/logout", (req, res)=>{
  req.session = null;
  res.redirect("/login");
});
app.get("/register",(req, res)=>{
  const templateVars = {user: users[req.session.userID]};
  res.render("urls_register", templateVars);
});
app.post("/register", (req, res)=>{
  let id = generateRandomString();
  if (!req.body.email || !req.body.password) { //stops registration if email or password is an empty string
    res.send("Error 400. Please fill out both sections.");
  } else if (checkEmailsEqual(req.body.email, users)) { //stops registration if email has been registered
    res.send("Error 404. Email already registered.");
  } else {
    const pass = req.body.password;
    const hashedPassword = bcrypt.hashSync(pass, 10);
    users[id] = { id, email: req.body["email"], password: hashedPassword}; //creats a new user
    res.redirect("/login");
  }
});
app.post("/urls/:shortURL/delete",(req, res)=>{
  let urlsArray = urlsForUser(req.session.userID, urlDatabase);
  for (const url of urlsArray) {
    if (req.params.shortURL === url) { //only runs if the current user owns given URL
      delete urlDatabase[req.params.shortURL];
      console.log("deleted");
    }
  }
  res.redirect("/urls");
});
app.post("/urls/:shortURL/edit", (req, res)=>{
  res.redirect(`/urls/${req.params.shortURL}`);
});
app.post("/urls/:shortURL/test",(req, res)=>{
  let urlsArray = urlsForUser(req.session.userID, urlDatabase);
  for (const url of urlsArray) {
    if (req.params.shortURL === url) { //only runs if current user owns given URL, and changes the value of the URL
      urlDatabase[req.params.shortURL] = {longURL: req.body.longURL, userID: req.session.userID};
      res.redirect("/urls");
    }
  }
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


