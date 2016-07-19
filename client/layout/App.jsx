import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import User from '../components/User.jsx';
import AuthToken from '../components/AuthToken.jsx';
import Pagination from '../components/Pagination.jsx';
import { Users } from '/imports/collections/users.js';

class App extends Component {

  constructor(props){
    super(props);
  }

  selectAll(event) {
    event.preventDefault();
    this.props.users.map((user) => {
      Users.update(user._id, {
        $set: { checked: true },
      })
    });
    console.log(this.props.users[0].profile.email);
  }

  deSelectAll(event) {
    event.preventDefault();
    this.props.users.map((user) => {
      Users.update(user._id, {
        $set: { checked: false},
      })
    });
  }

  renderUsers() {
    return this.props.users.map((user) => (
      <User key={user._id} user={user} />
    ));
  }

  render() {
    return (
      <div>
        <div className="ui fixed top panel" id="header">
          <div className="ui borderless main inverted blue secondary menu" id="main-menu">
            <div className="ui container">
              <div className="header item">
              <img className="logo" src="/images/logo.png" />
              Deleted User Recovery Tool
              </div>
            </div>
          </div>
        </div>
        <div className="ui left aligned container">
          <AuthToken />
          <div className="ui divider"></div>
          <Pagination />
          <table className="ui compact selectable definition table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {this.renderUsers()}
            </tbody>
          </table>
          <button className="ui secondary button" onClick={this.selectAll.bind(this)}>
            Select all</button>
          <button className="ui button" onClick={this.deSelectAll.bind(this)}>
            Deselect all</button>
          <button className="ui primary button" type="submit">Restore selected</button>
          <br/><br/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  users: PropTypes.array.isRequired,
  //currentPage: React.PropTypes.Number
};

export default createContainer(() => {
  return {
    users: Users.find({}).fetch(),
  };
}, App);
