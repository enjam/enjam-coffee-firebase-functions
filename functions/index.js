const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  //console.log(request.url);
  //console.log(Object.keys(request.params));
  console.log(Object.keys(request.query));
  response.send(request.query['hub.challenge']);
});
