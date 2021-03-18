const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser")

function generateRandomString() {
  const Char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ""
  for(let i = 0; i < 6; i++){
  randomString += Char.charAt(Math.floor(Math.random()*Char.length))
  }
  return randomString
}

function checkEmailsEqual(email2){
  for(key in users){
    if(users[key].email === email2){
      return true
    }
  }
  return false
}


//requires ejs
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
}

app.get("/",(req, res)=>{
  res.send("Hello!");
})
//Since we're following the Express convention of using a views directory, we can take advantage of a useful EJS shortcut! EJS automatically knows to look inside the views directory for any template files that have the extension .ejs.
app.get("/urls", (req, res)=>{
  const templateVars = {urls: urlDatabase, user: users[req.cookies.userID]}
res.render("urls_index", templateVars)
});
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies.userID]}
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // Log the POST request body to the console
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL //pushes a new short URL to the database
  res.redirect(`/urls/${shortURL}`);         
});
app.get("/urls/:shortURL",(req, res)=>{
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies.userID]}
  res.render("urls_show", templateVars)
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] // urlDatabase[shortURL] ??
  res.redirect(longURL);
});
app.get("/login", (req, res)=>{
  const templateVars = {user: users[req.cookies.userID]}
res.render("urls_login", templateVars)
});
app.post("/urls/login/", (req, res)=>{
  res.cookie("username", req.body.username)
  res.redirect("/urls")
});
app.post("/urls/logout/", (req, res)=>{
  res.clearCookie("username")
  res.redirect("/urls")
});
app.get("/register",(req, res)=>{
  const templateVars = {user: users[req.cookies.userID]}
res.render("urls_register", templateVars)
});
app.post("/register", (req, res)=>{
  let id = generateRandomString()
  if(!req.body.email || !req.body.password){
    res.send("Error 400")
  } else if(checkEmailsEqual(req.body.email)){
    res.send("Error 404")
  } else {
  console.log(req.body)
  users[id] = { id, email: req.body["email"], password: req.body["password"]}
  res.cookie("userID", id)
  res.redirect("/urls")
  }
});
app.post("/urls/:shortURL/delete",(req, res)=>{
  delete urlDatabase[req.params.shortURL]
  console.log(urlDatabase)
  console.log("deleted")
  res.redirect("/urls")
});
app.post("/urls/:shortURL/edit", (req, res)=>{
  console.log("button was pushed")
  res.redirect(`/urls/${req.params.shortURL}`)
});
app.post("/urls/:shortURL/test",(req, res)=>{
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});


