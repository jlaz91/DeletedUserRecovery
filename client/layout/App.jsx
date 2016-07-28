import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Menu from '../components/Menu.jsx'
import User from '../components/User.jsx';
import AuthToken from '../components/AuthToken.jsx';
import { Users } from '/imports/collections/users.js';

const RECORDS_PER_PAGE = 100;
const pageNumber = new ReactiveVar(1);

class App extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        pageNumber.set(pageNumber.get() + 1);
      }
    });
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
    return this.props.users.map((user) => (
      <User key={user._id} user={user} />
    ));
  }

  render() {

    return (
      <div>
        <Menu checkedCount={this.props.checkedCount} users={this.props.users} />
        <br/><br/><br/><br/>
        <div className="ui left aligned container">
          <AuthToken />
          <div className="ui divider"></div>
          <div className="ui segment">
          <button className="ui secondary button" onClick={this.selectAll.bind(this)}>
            Select all</button>
          <button className="ui button" onClick={this.deSelectAll.bind(this)}>
            Deselect all</button>
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
  Meteor.subscribe('users', RECORDS_PER_PAGE * pageNumber.get());
  return {
    users: Users.find({}, {sort: {_id: -1}}).fetch(),
    checkedCount: Users.find({checked: true}).count(),
  };
}, App);
