import { Users } from '/imports/collections/users.js';

const headersConst = {
  'Content-Type': 'application/json'
};

Meteor.methods({
  clearMembers: function() {
    Users.remove({});
  },
  
  setToken: function(token) {
    console.log(token);
    headersConst.Authorization = "Bearer " + token;
  },

  storeMembers: function(result) {
    const response = result.content.replace(/\.tag/g,'tag');
    users = JSON.parse(response);

    users.members.map((user) => {
      //if(user.profile.status.tag == "removed") {
      console.log(user.profile.status.tag);
      Users.insert(user);
    });

    if(users.has_more) {
      Meteor.call('getMoreMembers', users.cursor);
    }

  },

  getMembers: function() {
    // Calling Dropbox events API
    try {
      const result = HTTP.call("POST", "https://api.dropboxapi.com/2/team/members/list", {
        headers: headersConst,
        data: {
          "include_removed": true,
        }
      });

      Meteor.call('storeMembers', result);
      return true;

    } catch(e) {
      if ( e.response.statusCode == 400 ) {
        return throwError('no-token', 'Invalid token.');
      } else {
        return throwError('unknown', 'Unknown error.');
      }
    }

  },

  getMoreMembers: function(cursor) {
    const result = HTTP.call("POST", "https://api.dropboxapi.com/2/team/members/list/continue", {
      headers: headersConst,
      data: {
        "cursor": cursor,
      }
    });

    Meteor.call('storeMembers', result);
  }

});
