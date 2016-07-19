import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Menu from '../components/Menu.jsx'
import User from '../components/User.jsx';
import AuthToken from '../components/AuthToken.jsx';
import Pagination from '../components/Pagination.jsx';
import { Users } from '/imports/collections/users.js';

const RECORDS_PER_PAGE = 100;
const startAt = 0;
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
    const leftArrow = "<";
    const rightArrow = ">";

    return (
      <div>
        <Menu />
        <div className="ui left aligned container">
          <AuthToken />
          <div className="ui divider"></div>
            {/*}
            <div className="ui pagination menu">
              <button className="item" onClick={this.loadMore.bind(this)}>{leftArrow}</button>
              <button className="item" >{rightArrow}</button>
            </div>*/}
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
  Meteor.subscribe('users', RECORDS_PER_PAGE * pageNumber.get(), startAt);
  return {
    users: Users.find({}, {sort: {_id: -1}}).fetch(),
  };
}, App);
