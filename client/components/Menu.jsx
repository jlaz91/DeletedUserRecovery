import React, { PropTypes, Component } from 'react';

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {restoring: false};
  }

  compononentDidMount() {
    this.setState({restoring: false});
  }

  restoreSelected() {
    this.setState({restoring: true});
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
    }).then(()=> {
      this.setState({restoring: false});
    });
  }

  noneSelected() {
    $(".none.message").transition('slide down');
    setTimeout(function() {
      $(".none.message").transition('slide down');
    }, 4000);
  }


  render() {
    let restoreButton;
    if (!this.state.restoring) {
      restoreButton =
        <div className="right header item">
          <button className="ui inverted button" type="submit" onClick={
            this.props.checkedCount ? this.restoreSelected.bind(this) :
            this.noneSelected.bind(this)}>Restore selected
          </button>
        </div>;
    } else  {
      restoreButton =
        <div>
          <div className="ui active dimmer">
            <div className="ui small text loader">Restoring...Please wait.</div>
          </div>
          <p></p>
        </div>;
    }
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
                {restoreButton}
            </div>
          </div>
        </div>
    );
  }
}

Menu.PropTypes={
  restoring: PropTypes.bool.isRequired,
};
