import { Mongo } from 'meteor/mongo';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  Meteor.publish('users', (start) => {
    return Users.find({ UID: {$gte: start} }, {sort: {recovered: -1}, limit: 20});
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
