const { assert } = require('chai');

const {generateRandomString, checkEmailsEqual, findIDbyEmail, urlsForUser} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": {longURL: "http://lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://google.com", userID: "aJ48lW"}
};

describe('findIDbyEmail', function() {
  it('should return a user with valid email', function() {
    const user = findIDbyEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.isTrue(user === expectedOutput)
  });
  it('should return undefined', function() {
    const user = findIDbyEmail("fake@fake.com", testUsers)
    const expectedOutput = undefined;
    assert.isTrue(user === expectedOutput)
  });
});

describe('urlsForUser', function() {
  it('should return an array with urls', function() {
    const urls = urlsForUser("aJ48lW", urlDatabase)
    const expectedOutput = ['b2xVn2', '9sm5xK'];
    assert.deepEqual(urls, expectedOutput)
  });
});

describe('checkEmailsEqual', function() {
  it('should return true if the email exists in the object', function() {
    const emails = checkEmailsEqual("user@example.com", testUsers)
    assert.isTrue(emails)
  });
  it('should return false if the email does not exist in the object', function() {
    const emails = checkEmailsEqual("fake@fake.com", testUsers)
    assert.isTrue(!emails)
  });
});