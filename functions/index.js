const functions = require('firebase-functions');
const admin = require('firebase-admin');

const pageLikePoints = 10;
const postLikePoints = 5;
const postCommentPoints = 5;

admin.initializeApp(functions.config().firebase);

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
