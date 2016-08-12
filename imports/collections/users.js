import { Mongo } from 'meteor/mongo';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  Meteor.publish('users', (start) => {
    return Users.find({ UID: {$gte: start} }, {sort: {recovered: -1}, limit: 20});
  });
}

Meteor.methods({
  'users.selectAll'(users) {
    users.map((user) => {
      Users.update(user._id, { $set: {checked: true}});
    });
  },

  'users.deSelectAll'(users) {
    users.map((user) => {
      Users.update(user._id, { $set: {checked: false}});
    });
  }
});
