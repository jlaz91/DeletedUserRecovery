import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class AuthToken extends Component {

  /*componentDidMount() {
  $('.circle.icon')
    .popup({
      inline : true,
      hoverable : true
    });
  }*/

  handleAuth(event) {
    const token = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('setToken', token);
    Meteor.call('getMembers');
  }

  render() {
    return(
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
    );
  }
}
