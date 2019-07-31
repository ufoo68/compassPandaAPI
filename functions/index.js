'use strict';

const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = express();

const ALLOWED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS'
];

const ALLOWED_ORIGINS = [
  'https://127.0.0.1:3000',
  'https://127.0.0.1:3001',
  'http://localhost:3000/'
];

// レスポンスHeaderを組み立てる
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
      sess.cookie.secure = true;
      res.cookie('example', Math.random().toString(), {maxAge: 86400, httpOnly: true});
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
      res.setHeader('Access-Control-Allow-Headers', 'Content-type,Accept,X-Custom-Header');
  }

  next();
});

// HTTP OPTIONS
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/locate', (req, res) => {
    return handleEvent(req.body)
    .then((result) => res.json(result));
});

function handleEvent(body) {
  console.log(body);
  db.collection('locateTweet').doc('data').set(JSON.parse(body), { merge: true });
  console.log('writed');
  return Promise.resolve(body);
}

app.get('/map', (req, res) => {
  return db.collection("locateTweet").doc("data")
  .get()
  .then((querySnapshot) => res.send(JSON.stringify(querySnapshot.data())));
});

exports.app = functions.https.onRequest(app);