const express = require("express");
const app = express();
const PORT = 8080;

//requires ejs
app.set("view engine", "ejs")


const urlDatabase = {
  "b2xVn2": "http://lighthouslabs.ca",
  "9sm5xK": "http://google.com"
};

app.get("/",(req, res)=>{
  res.send("Hello!");
})
//Since we're following the Express convention of using a views directory, we can take advantage of a useful EJS shortcut! EJS automatically knows to look inside the views directory for any template files that have the extension .ejs.
app.get("/urls", (req, res)=>{
  const templateVars = {urls: urlDatabase}
res.render("urls_index", templateVars)
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