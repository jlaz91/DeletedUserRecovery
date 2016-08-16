import { Users } from '/imports/collections/users.js';

let UID = 0;
const headersConst = {
  'Content-Type': 'application/json',
  'User-Agent': 'DeletedUserRecoveryTool-macOS'
};

let userList = [];

Meteor.methods({
  clearMembers: function() {
    userList = [];
    Users.remove({});
  },

  setToken: function(token) {
    headersConst.Authorization = "Bearer " + token;
  },

  storeMembers: function(result) {
    let response = result.content.replace(/\.tag/g,'tag');
    users = JSON.parse(response);

    users.members.map((user) => {
      if (user.profile.status.is_recoverable) {
        user.UID = UID;
        user.checked = false;
        user.recovered = false;
        user.recovering = false
        userList.push(user);
        UID+=1;
      }
    });

    if(users.has_more) {
      Meteor.call('getMoreMembers', users.cursor);
    } else {
      for (i = 0; i < userList.length; i++) {
        Users.insert(userList[i]);
      }
    }
  },

  getMembers: function() {
    // Calling Dropbox events API
    UID = 0;
    try {
      let result = HTTP.call("POST", "https://api.dropboxapi.com/2/team/members/list", {
        headers: headersConst,
        data: {
          "include_removed": true,
        }
      });
      console.log(result);
      Meteor.call('storeMembers', result);

    } catch(e) {
      if ( e.response.statusCode == 400 ) {
        return throwError('no-token', 'Invalid token.');
      }
    }

  },

  getMoreMembers: function(cursor) {
    let result = HTTP.call("POST", "https://api.dropboxapi.com/2/team/members/list/continue", {
      headers: headersConst,
      data: {
        "cursor": cursor,
      }
    });

    Meteor.call('storeMembers', result);
  },

  recoverMembers: function() {
    Users.find().forEach( function(user) {
      if (user.checked && !user.recovered) {
        let memberID = user.profile.team_member_id;
        let userEmail = user.profile.email;
        Users.update(user._id, {
          $set: { recovering: true },
        });
        try {
          let result = HTTP.call("POST", 'https://api.dropboxapi.com/2/team/members/recover', {
            headers: headersConst,
            data: {
              "user": {
                ".tag": "team_member_id",
                "team_member_id": memberID,
              }
            }
          });
          Users.update(user._id, {
            $set: { recovered: true },
          });
        } catch(e) {
          return throwError('user-not-recovered', userEmail + 'could not be recovered.');
        }
      }
    });
    return throwError('all-users-recovered', 'Selected users were recovered successfully.');

  },

});
