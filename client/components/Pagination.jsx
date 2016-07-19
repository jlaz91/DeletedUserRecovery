import React, { Component, PropTypes } from 'react';
import { Users } from '/imports/collections/users.js';

export default class Pagination extends Component {

  constructor(props){
    super(props);
  }

  renderUsers(page) {
    userRows = [];
    for(j=0; j<page*100; j++) {
      userRows.push(<User key={this.props.users[j]} user={this.props.user[j]} />)
    }
    return userRows;
  }

  render() {
    let rows=[];
    let numPages = Users.find({}).count() / 5;
    const leftArrow = "<";
    const rightArrow = ">";
    
    rows.push(<a className="item" key='0'>{leftArrow}</a>);
    for(i=1; i<numPages+1; i++) {
      rows.push(<a className="item" key={i}>{i}</a>);
    }
    rows.push(<a className="item" key={numPages+1}>{rightArrow}</a>);

    return (
      <div className="ui pagination menu">
        {rows}
      </div>
    );
  }
}
