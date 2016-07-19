import { Mongo } from 'meteor/mongo';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  Meteor.publish('users', (limit, startAt) => {
    new SimpleSchema({
      limit: {type: Number},
      startAt: {type: Number}
    }).validate({limit, startAt});

    return Users.find({}, {limit: limit});
  });
}
