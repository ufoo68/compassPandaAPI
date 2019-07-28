'use strict';

const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = express();

app.post('/locate', (req, res) => {
    return handleEvent(req.body)
    .then((result) => res.json(result));
});

function handleEvent(body) {

  db.collection('locateTweet').doc('data').set(body, { merge: true });
  console.log('writed');
  return Promise.resolve(body);
}

exports.app = functions.https.onRequest(app);