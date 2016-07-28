throwError = function(error, reason) {
  let meteorError = new Meteor.Error(error, reason);
  if (Meteor.isClient) {
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};
