const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

function generateRandomString() {
  const Char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ""
  for(let i = 0; i < 6; i++){
  randomString += Char.charAt(Math.floor(Math.random()*Char.length))
  }
  return randomString
}

//requires ejs
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://lighthouslabs.ca",
  "9sm5xK": "http://google.com"
};

let shortURL = generateRandomString()

app.get("/",(req, res)=>{
  res.send("Hello!");
})
//Since we're following the Express convention of using a views directory, we can take advantage of a useful EJS shortcut! EJS automatically knows to look inside the views directory for any template files that have the extension .ejs.
app.get("/urls", (req, res)=>{
  const templateVars = {urls: urlDatabase}
res.render("urls_index", templateVars)
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL //pushes a new short URL to the database
  res.redirect(`/urls/${shortURL}`);         
});

app.get("/urls/:shortURL",(req, res)=>{
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show", templateVars)
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
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