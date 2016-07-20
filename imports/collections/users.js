import { Mongo } from 'meteor/mongo';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  Meteor.publish('users', (limit) => {
    new SimpleSchema({
      limit: {type: Number},
    }).validate({limit});

    return Users.find({}, {limit: limit});
  });
}

Meteor.methods({
  'users.selectAll'() {
    Users.update({}, { $set: {checked: true}}, {multi: true});
  },

  'users.deSelectAll'() {
    Users.update({}, { $set : {checked: false}}, {multi: true});
  }
});
