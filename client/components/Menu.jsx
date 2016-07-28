import React, { Component } from 'react';

export default class Menu extends Component {

  restoreSelected() {
    Meteor.call('recoverMembers');
  }

  render() {
    return (
      <div className="ui fixed top panel attached sticky" id="header">
        <div className="ui borderless main inverted blue secondary menu" id="main-menu">
          <div className="ui container">
            <div className="header item">
            <img className="logo" src="/images/logo.png" />
            Deleted User Recovery Tool
            </div>
            <div className="right header item">
              <button className="ui inverted button" type="submit" onClick={this.restoreSelected.bind(this)}>Restore selected ({this.props.checkedCount})</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
