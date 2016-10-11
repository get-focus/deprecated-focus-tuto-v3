import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';

const actions = {
  primary: [
    {icon: 'face', label: 'face', action: () => console.log('User Form')},
    {icon: 'event', label: 'event', action: () => console.log('User Form')}
  ],
  secondary: [
    {label: 'Informations', action: () => console.log('User Form')},
    {label: 'Settings', action: () => console.log('User Form')}
  ]
}

class User extends Component {
  componentWillMount() {
    const {id, load, injectActionHeader, triggerPosition} = this.props;
    // Et voilà un load !
    load({id});
    triggerPosition(0);
    injectActionHeader(actions);
  }

  render() {
    const {fieldFor} = this.props;
    return (
      <Panel title='User' {...this.props}>
        {fieldFor('uuid')}
        {fieldFor('firstName')}
        {fieldFor('lastName')}
      </Panel>
    );
  }
};

const formConfig = {
  formKey: 'userForm',
  entityPathArray: ['user'],
  loadAction: loadUserAction,
  saveAction: saveUserAction,
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToForm(formConfig),
  connectToFieldHelpers()
)(User);

export default ConnectedUserForm;
