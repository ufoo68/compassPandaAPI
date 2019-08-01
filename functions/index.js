'use strict';

const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = express();

// レスポンスHeaderを組み立てる
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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