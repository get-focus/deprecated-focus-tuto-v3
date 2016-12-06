import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
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
    const {id, load, clear, loadMasterData, injectActionHeader, triggerPosition} = this.props;
    // Et voilà un load !
    if(id) {
      load({id});
    } else {
      clear({isActive: true});
    }
    loadMasterData();
    triggerPosition(0);
    injectActionHeader(actions);
    console.log('PROPS', this.props);
  }

  render() {
    const {fields, fieldFor, selectFor} = this.props;
    const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
    return (
      <Panel title='User' {...this.props}>
        {fieldFor('uuid')}
        {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
        {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('firstName', {entityPath: 'user'})}
        {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('lastName', {entityPath: 'user'})}
        {fieldFor('firstName')}
        {fieldFor('date')}
        {fieldFor('accountsNames')}
      </Panel>
    );
  }
};

const formConfig = {
  formKey: 'userForm',
  entityPathArray: ['user'],
  loadAction: loadUserAction,
  saveAction: saveUserAction,
  nonValidateFields: ['lastName'],
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToMasterData(['civility']),
  connectToForm(formConfig),
  connectToFieldHelpers()
)(User);

export default ConnectedUserForm;
