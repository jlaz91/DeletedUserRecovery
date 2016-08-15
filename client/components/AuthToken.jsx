import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Users } from '/imports/collections/users.js';

import ReactDOM from 'react-dom';

export default class AuthToken extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  $('.circle.icon')
    .popup({
      inline : true,
      hoverable : true
    });
  }

  handleAuth(event) {
    event.preventDefault();
    Meteor.call('clearMembers');
    $(".loadTime.message").transition('slide down');
    const token = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('setToken', token);

    let promise = Meteor.callPromise('getMembers');

    promise.then(()=> {
      $(".loadTime.message").transition('slide down');
    }).catch(function(error) {
      $(".loadTime.message").transition('slide down');
      if(error.error == 'no-token') {
        $(".badToken.message").transition('slide down');
        setTimeout(function() {
          $(".badToken.message").transition('slide down');
        }, 4000);
      }
    });
  }

  badTokenMessage() {
    return(
      <div className="ui center aligned hidden negative badToken message">
        <div className="header">Error</div>
        <p>Please check that you are using a valid token.</p>
      </div>
    )
  }

  noRecoverableMessage() {
    return(
      <div className="ui center aligned hidden negative noRecoverable message">
        <div className="header">No recoverable users.</div>
        <p>You can only restore users within 7 days. Please contact support.</p>
      </div>
    )
  }

  unknownMessage() {
    return(
      <div className="ui center aligned hidden negative unknown message">
        <div className="header">Unknown error</div>
        <p>Please check your network connection.</p>
      </div>
    )
  }

  allUsersRecoveredMessage() {
    return(
      <div className="ui center aligned hidden positive success message">
        <div className="header">Success!</div>
        <p>All selected users were recovered.</p>
      </div>
    )
  }

  recoveryFailedMessage() {
    return(
      <div className="ui center aligned hidden negative recoveryFailed message">
        <div className="header">Recovery failed</div>
        <p>Please contact support for help.</p>
      </div>
    )
  }

  exceptionMessage() {
    return(
      <div className="ui center aligned hidden negative exception message">
        <div className="header">Unknown error</div>
        <p>An unknown error occurred.</p>
      </div>
    )
  }

  loadTimeMessage() {
    return(
      <div className="ui center aligned hidden icon loadTime message">
        <i className="notched circle loading icon"></i>
        <div className="content">
          <div className="header">
            Searching for recoverable users
          </div>
          <p>Please note users are only recoverable within 7 days of deletion.</p>
        </div>
      </div>
    )
  }

  noneMessage() {
    return(
      <div className="ui center aligned hidden negative none message">
        <div className="header">No users selected</div>
        <p>Please choose the users you would like to restore.</p>
      </div>
    )
  }

  render() {
    return(
      <div>
        {this.loadTimeMessage()}
        {this.allUsersRecoveredMessage()}
        {this.recoveryFailedMessage()}
        {this.exceptionMessage()}
        {this.badTokenMessage()}
        {this.noRecoverableMessage()}
        {this.unknownMessage()}
        {this.noneMessage()}
        <div className="ui container">
          <h2>Recover Deleted Users</h2>
          <form className="ui form" onSubmit={this.handleAuth.bind(this)}>
            <div className="inline fields">
              <div className="field">
              <label>Access token</label>
              </div>
              <div className="field">
              <i className="info circle icon"
              data-content="Generate an access token in your app console at https://www.dropbox.com/developers/apps/. Your app will need team member file access."
              data-variation="inverted wide"></i>
              </div>
            </div>
            <div className="field">
              <input type="text" ref="textInput" placeholder="Enter access token..." />
            </div>
            <button className="ui primary button" type="submit">Get deleted users</button>
          </form>
        </div>
      </div>
    );
  }
}
