import React, { Component } from 'react';

export default class Menu extends Component {

  restoreSelected() {
    let promise = Meteor.callPromise('recoverMembers');

    promise.catch(function(error) {
      if(error.error == 'users-not-recovered') {
        $(".recoveryFailed.message").transition('slide down');
        setTimeout(function() {
          $(".recovered.message").transition('slide down');
        }, 4000);
      } else if (error.error == 'all-users-recovered') {
        $(".success.message").transition('slide down');
        setTimeout(function() {
          $(".success.message").transition('slide down');
        }, 4000);
      } else {
        $(".exception.message").transition('slide down');
        setTimeout(function() {
          $(".exception.message").transition('slide down');
        }, 4000);
      }
    });
  }

  noneSelected() {
    $(".none.message").transition('slide down');
    setTimeout(function() {
      $(".none.message").transition('slide down');
    }, 4000);
  }

  render() {
    return (
      <div className="ui fixed top panel attached sticky" id="header">
        <div className="ui borderless main inverted blue secondary menu" id="main-menu">
          <div className="ui container">
            <div className="header item">
            <img className="logo" src="/images/logo.png" />
              <a className="item">
                Deleted User Recovery Tool
              </a>
            </div>
            <div className="right header item">
              <button className="ui inverted button" type="submit" onClick={
                  this.props.checkedCount ? this.restoreSelected.bind(this) :
                  this.noneSelected.bind(this)}>Restore selected</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
