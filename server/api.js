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
    let recoverableCount = 0;

    users.members.map((user) => {
      if (user.profile.status.is_recoverable) {
        recoverableCount += 1;
        user.checked = false;
        user.recovered = false;
        Users.insert(user);
      }
    });

    if(users.has_more) {
      Meteor.call('getMoreMembers', users.cursor);
    } else if (recoverableCount == 0) {
      return throwError('no-recoverable-users', 'No users.');
    } else {
      return true;
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

    } catch(e) {
      if (e.error == 'no-recoverable-users') {
        return throwError('no-recoverable-users', 'No users.');
      }
      else if ( e.response.statusCode == 400 ) {
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
  },

  recoverMembers: function() {
    Users.find().forEach( function(user) {
      if (user.checked) {
        let memberID = user.profile.team_member_id;
        let userEmail = user.profile.email;
        console.log("Recovering: " + userEmail);

        try {
          const result = HTTP.call("POST", 'https://api.dropboxapi.com/2/team/members/recover', {
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

          console.log("Recovered " + userEmail);

        } catch(e) {
          console.log(e);
          return throwError('user-not-recovered', userEmail + 'could not be recovered.');
        }
      }
    });
    return throwError('all-users-recovered', 'Selected users were recovered successfully.');

  },

});
