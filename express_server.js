const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session')
const {generateRandomString, checkEmailsEqual, findIDbyEmail, urlsForUser} = require("./helper")
/*
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
};
*/
/*function checkPasswordsEqual(password2, email2){
  for(key in users){
    if(users[key].password === password2 && users[key].email === email2){
      return true
    }
  }
  return false
};*/
/*
function findIDbyEmail(email2, database){
  for(key in database){
    if(database[key].email === email2)
    return key
    }
  
};

function urlsForUser(id){
  usersIDs = []
  for(url in urlDatabase){
    console.log(urlDatabase[url].userID)
    if(urlDatabase[url].userID === id){
    usersIDs.push(url)
    }
  }
  return usersIDs
};
*/

//req.session.userID = "some value";

//requires ejs
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))

const urlDatabase = {
  /*"b2xVn2": {longURL: "http://lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://google.com", userID: "aJ48lW"}*/
};

const users = {
  /*"userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "otherRandomID": {
    id: "otherRandomID",
    email: "elikaplan@me.com",
    password: "password"
  }*/
}


app.get("/",(req, res)=>{
  res.send("Hello!");
});
app.get("/urls", (req, res)=>{
  const templateVars = {urls: urlDatabase, user: users[req.session.userID], userID: req.session.userID}
  console.log(templateVars)
res.render("urls_index", templateVars)
});
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.session.userID]}
  if(req.session.userID === undefined){
    res.redirect("/login")
  }
  res.render("urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // Log the POST request body to the console
  let shortURL = generateRandomString()
  urlDatabase[shortURL] =  {longURL: req.body.longURL, userID: req.session.userID}//pushes a new short URL to the database
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);         
});
app.get("/urls/:shortURL",(req, res)=>{
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session.userID]}
  console.log(urlDatabase)
  console.log(templateVars)
  res.render("urls_show", templateVars)
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL // urlDatabase[shortURL] ??
  res.redirect(longURL);
});
app.get("/login", (req, res)=>{
  const templateVars = {user: users[req.session.userID]}
res.render("urls_login", templateVars)
});
app.post("/login", (req, res)=>{
  if(!checkEmailsEqual(req.body.email, users)){
    res.send("Error 403")
  };
  if(!bcrypt.compareSync(req.body.password, users[findIDbyEmail(req.body.email, users)].password)){
    res.send("Error 403")
  } else {
    req.session.userID = findIDbyEmail(req.body.email, users)
    res.redirect("/urls")
  }
});
app.post("/urls/logout", (req, res)=>{
  //res.clearCookie("userID")
  req.session = null
  res.redirect("/login")
});
app.get("/register",(req, res)=>{
  const templateVars = {user: users[req.session.userID]}
res.render("urls_register", templateVars)
});
app.post("/register", (req, res)=>{
  let id = generateRandomString()
  if(!req.body.email || !req.body.password){
    res.send("Error 400")
  } else if(checkEmailsEqual(req.body.email, users)){
    res.send("Error 404")
  } else {
    const pass = req.body.password
    const hashedPassword = bcrypt.hashSync(pass, 10);
  users[id] = { id, email: req.body["email"], password: hashedPassword}
  console.log(users)
  
  res.redirect("/login")
  }
});
app.post("/urls/:shortURL/delete",(req, res)=>{
  let urlsArray = urlsForUser(req.session.userID, urlDatabase)
  for(url of urlsArray){
    if(req.params.shortURL === url){
      delete urlDatabase[req.params.shortURL]
      console.log("deleted")
    }
  }
  res.redirect("/urls")
});
app.post("/urls/:shortURL/edit", (req, res)=>{
  console.log("button was pushed")
  res.redirect(`/urls/${req.params.shortURL}`)
});
app.post("/urls/:shortURL/test",(req, res)=>{
  let urlsArray = urlsForUser(req.session.userID, urlDatabase)
  for(url of urlsArray){
    if(req.params.shortURL === url){
  urlDatabase[req.params.shortURL] = {longURL: req.body.longURL, userID: req.session.userID}
  console.log("boop")
  res.redirect("/urls")
    }
  }
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


