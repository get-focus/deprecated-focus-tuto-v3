import React, {Component} from 'react';
import find from 'lodash/find';

import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';

import Autocomplete from 'focus-components/autocomplete-text/field';

const actions = {
  primary: [
    {icon: 'verified_user', label: 'verified_user', action: () => console.log('User Form')},
    {icon: 'timeline', label: 'timeline', action: () => console.log('User Form')}
  ],
  secondary: [
    {label: 'Informations', action: () => console.log('User Form')},
    {label: 'Settings', action: () => console.log('User Form')}
  ]
}

const _querySearcher = query => {
    let data = [
        {
            key: 'JL',
            label: 'Joh Lickeur'
        },
        {
            key: 'GK',
            label: 'Guénolé Kikabou'
        },
        {
            key: 'YL',
            label: 'Yannick Lounivis'
        }
    ];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: data.length
            });
        }, 500);
    });
};

class UserForm extends Component {
  componentWillMount() {
    const {id, load, loadMasterData, injectActionHeader, triggerPosition} = this.props;
    load({id});
    loadMasterData();
    injectActionHeader(actions);
    triggerPosition(0);
  }

  render() {
    const {fields, fieldFor, selectFor, editing} = this.props;
    const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
    return (
      <div>
        <Panel title={`User's finances`} {...this.props}>
          {fieldFor('uuid', {entityPath: 'user'})}
          {fieldFor('style',  {entityPath: 'user'})}
        </Panel>
        <Autocomplete
          isEdit={true}
          querySearcher={_querySearcher}
          placeholder={'Your search...'}
          onChange={(value) => console.log(value)}
          />
      </div>
    );
  }
};

UserForm.displayName = 'UserForm';

const formConfig = {
  formKey: 'userFinanceForm',
  entityPathArray: ['user', 'address'],
  loadAction: loadUserAction,
  saveAction: saveUserAction,
  nonValidatedFields: ['user.firstName', 'address.city', 'user.accountsNames', 'address.uuid', 'user.civility'],
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToMasterData(['civility']),
  connectToForm(formConfig),
  connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
