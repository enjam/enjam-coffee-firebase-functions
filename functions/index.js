const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

const pageLikePoints = 10;
const postLikePoints = 5;
const postCommentPoints = 5;

admin.initializeApp(functions.config().firebase);
/*
exports.FbPageLikeHandler = functions.database.ref('/pageLikes/{user_id}').onWrite(event => {
  if (event.data.previous.exists()) {
    return;
  }
  const user_id = event.params.user_id;
  var scoreRef = admin.database().ref('/scores/' + user_id);
  scoreRef.transaction(function(score) {
    if (score) {
      score=score+pageLikePoints;
    } else {
      score=pageLikePoints;
    }
    return score;
  });
});

exports.FbPostLikeHandler = functions.database.ref('/postLikes/{post_id}/{user_id}').onWrite(event => {
  if (event.data.previous.exists()) {
    return;
  }
  const user_id = event.params.user_id;
  var scoreRef = admin.database().ref('/scores/' + user_id);
  scoreRef.transaction(function(score) {
    if (score) {
      score=score+postLikePoints;
    } else {
      score=postLikePoints;
    }
    return score;
  });
});

exports.FbPostCommentHandler = functions.database.ref('/postComment/{post_id}/{user_id}').onWrite(event => {
  if (event.data.previous.exists()) {
    return;
  }
  const user_id = event.params.user_id;
  var scoreRef = admin.database().ref('/scores/' + user_id);
  scoreRef.transaction(function(score) {
    if (score) {
      score=score+postLikePoints;
    } else {
      score=postLikePoints;
    }
    return score;
  });
});
*/

function handleCorrectUserPattern(user, duration){
  return admin.database().ref()
    .child('durations').child(user)
    .transaction(previousDuration => {
      return previousDuration ? Math.min(previousDuration, duration) : duration;
    });
}

exports.adminActionHandler = functions.database.ref('adminActions/{action}').onCreate(event => {
  const action = event.params.action;
  const entry = event.data.val();
  if (action === 'rebuildDurations'){
    const ref = admin.database().ref();
    return ref.child('durations').remove()
      .then(() => ref.child('logs').once('value'))
      .then(snap => Promise.all(
        _.values(snap.val())
          .filter(entry => entry.type === 'correct userpattern')
          .map(entry => handleCorrectUserPattern(entry.user, entry.duration))
      ));
  }
});

exports.logEventHandler = functions.database.ref('logs/{logId}').onCreate(event => {
  const entry = event.data.val();
  if (entry.type == 'correct userpattern')
    handleCorrectUserPattern(entry.user, entry.duration);
});

exports.logUserCreation = functions.auth.user().onCreate(function(event) {
  const d = event.data;
  const fb_data = d.providerData.find(pd => pd.providerId === 'facebook.com');
  admin.database().ref('users').child(d.uid).set({
    displayName: d.displayName,
    email: d.email || false,
    photoURL: d.photoURL || false,
    fbUID: fb_data.uid,
  });
  admin.database().ref('fire2face').child(d.uid).set(fb_data.uid);
  admin.database().ref('face2fire').child(fb_data.uid).set(d.uid);
});
