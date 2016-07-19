import React, { Component } from 'react';

export default class Menu extends Component {
  render() {
    return (
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
    );
  }
}
