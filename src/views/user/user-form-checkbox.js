import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import InputSelect from 'focus-components/select-mdl';

import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';

const actions = {
  primary: [
    {icon: 'face', label: 'face', action: () => console.log('User Form')},
    {icon: 'keyboard_voice', label: 'keyboard_voice', action: () => console.log('User Form')}
  ],
  secondary: [
    {label: 'Informations', action: () => console.log('User Form')},
    {label: 'Settings', action: () => console.log('User Form')}
  ]
}

class UserForm extends Component {
  componentWillMount() {
    const {id, load, loadMasterData, injectActionHeader, triggerPosition, toggleEdit} = this.props;
    load({id});
    injectActionHeader(actions);
    triggerPosition(0);
    loadMasterData();
  }

  render() {
    const { fields, fieldFor, selectFor} = this.props;
    const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
    return (
      <Panel title='User Ref List Checkbox' {...this.props}>
        {fieldFor('uuid')}
        {fieldFor('style')}
        {selectFor('civility', {masterDatum: 'civility'})}
        {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('firstName')}
        {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('lastName')}
      </Panel>
    );
  }
};

UserForm.displayName = 'UserForm';

const formConfig = {
  formKey: 'userCheckListForm',
  entityPathArray: ['user'],
  loadAction: loadUserAction,
  saveAction: saveUserAction,
  nonValidatedFields: ['user.firstName', 'user.accountsNames'],
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToMasterData(['civility']),
  connectToForm(formConfig),
  connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
