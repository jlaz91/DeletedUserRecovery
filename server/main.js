import { Meteor } from 'meteor/meteor';
import { Users } from '../imports/collections/users.js';

Meteor.startup(() => {
  // code to run on server at startup
  Users.remove({});
});
