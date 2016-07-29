import React, { Component, PropTypes } from 'react';
import { Users } from '/imports/collections/users.js';

export default class User extends Component {

  toggleChecked() {
    Users.update(this.props.user._id, {
      $set: { checked: !this.props.user.checked },
    });
  }

  render() {
    const userCheckedClass = this.props.user.checked ? 'checked' : '';

    return(
      <tr className={userCheckedClass}>
        <td className="collapsing">
          <div className="ui fitted checkbox">
            <input type="checkbox"
              readOnly
              checked={this.props.user.checked}
              onClick={this.toggleChecked.bind(this)}
            />
          <label></label>
          </div>
        </td>
        <td className="collapsing">
          {this.props.user.profile.name.display_name}
        </td>
        <td className="collapsing">{this.props.user.profile.email}</td>
        <td className="collapsing">
          <div className="content">
            <i className={this.props.user.status='deleted' ? 'minus circle icon' : 'check circle icon'}></i>
          </div>
        </td>
      </tr>
    );
  }
}
