import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Menu from '../components/Menu.jsx'
import User from '../components/User.jsx';
import AuthToken from '../components/AuthToken.jsx';
import { Users } from '/imports/collections/users.js';

const pageNumber = new ReactiveVar(0);

class App extends Component {

  constructor(props){
    super(props);
  }

  loadPrevious() {
    if (pageNumber.get() >= 20) {
      pageNumber.set(pageNumber.get() - 20);
    }
  }

  loadNext() {
    if (this.props.users.length > 0) {
      pageNumber.set(pageNumber.get() + 20);
    }
  }

  selectAll(event) {
    event.preventDefault();
    Meteor.call('users.selectAll');
  }

  deSelectAll(event) {
    event.preventDefault();
    Meteor.call('users.deSelectAll');
  }

  renderUsers() {
    if(!this.props.loading){
      return this.props.users.map((user) => (
        <User key={user._id} user={user} />
      ));
    } else {
      return (
        <tr>
          <td>
            <div className="ui active inverted dimmer">
              <div className="ui medium text loader">Loading</div>
            </div>
            <p></p>
          </td>
        </tr>
      );
    }
  }

  render() {
    const loadNextClass = (this.props.users.length > 0) ?
    "ui blue left floated button" : "ui blue left floated disabled button";
    const loadPreviousClass = (pageNumber.get() < 20) ?
    "ui blue left floated disabled button" : "ui blue left floated button";

    return (
      <div>
        <Menu checkedCount={this.props.checkedCount} users={this.props.users} />
        <br/><br/><br/><br/>
        <div className="ui left aligned container">
          <AuthToken checkedCount={this.props.checkedCount} />
          <div className="ui divider"></div>
            <div className="ui segment">
              <div>
                <button className="ui secondary button" onClick={this.selectAll.bind(this)}>
                  Select all</button>
                <button className="ui button" onClick={this.deSelectAll.bind(this)}>
                  Deselect all</button>
              </div>
              <br/>
              <div>
                <button className={loadPreviousClass} onClick={this.loadPrevious.bind(this)}>
                  <i className="left arrow icon"></i>
                </button>
                <button className={loadNextClass} onClick={this.loadNext.bind(this)}>
                  <i className="right arrow icon"></i>
                </button>
              </div>
              <br/><br/>
              <table className="ui compact selectable definition table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderUsers()}
                </tbody>
              </table>
            </div>
          <br/><br/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
   users: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const subHandle = Meteor.subscribe('users', pageNumber.get());
  const loading = !subHandle.ready();
  const users = Users.find().fetch();
  const checkedCount = Users.find({checked: true}).count();
  return {
    loading,
    users,
    checkedCount
  };
}, App);
