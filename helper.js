function generateRandomString() {
  const Char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ""
  for(let i = 0; i < 6; i++){
  randomString += Char.charAt(Math.floor(Math.random()*Char.length))
  }
  return randomString
}

function checkEmailsEqual(email2, database){
  for(key in database){
    if(database[key].email === email2){
      return true
    }
  }
  return false
};


function findIDbyEmail(email2, database){
  for(key in database){
    if(database[key].email === email2)
    return key
    }
  
};

function urlsForUser(id, database){
  usersIDs = []
  for(url in database){
    console.log(database[url].userID)
    if(database[url].userID === id){
    usersIDs.push(url)
    }
  }
  return usersIDs
};



module.exports = { generateRandomString, checkEmailsEqual, findIDbyEmail, urlsForUser}