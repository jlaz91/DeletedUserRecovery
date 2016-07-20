import { Users } from '/imports/collections/users.js';

const headersConst = {
  'Content-Type': 'application/json'
};

Meteor.methods({
  setToken: function(token) {
    console.log(token);
    headersConst.Authorization = "Bearer " + token;
  },

  getMembers: function() {
    // Calling Dropbox events API
    const result = HTTP.call("POST", "https://api.dropboxapi.com/2/team/members/list", {
      headers: headersConst,
      data: {
        "include_removed": true,
      }
    });
    const response = result.content.replace(/\.tag/g,'tag');
    users = JSON.parse(response);

    users.members.map((user) => {
      //if(user.profile.status.tag == "removed") {
        console.log(user.profile.status.tag);
      Users.insert(user);
    });
  },

});
