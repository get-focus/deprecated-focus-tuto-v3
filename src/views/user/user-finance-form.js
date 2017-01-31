import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';

import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import FinancialMoveLine from './financialMoveLine'

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

const User = ({fieldFor,listFor, ...otherProps}) => (
  <Panel title='User' {...otherProps}>
  {fieldFor('uuid', {entityPath: 'user'})}
  {fieldFor('firstName', {entityPath: 'user'})}
  {fieldFor('lastName', {entityPath: 'user'})}
  {fieldFor('name', {entityPath: 'finance'})}
  {fieldFor('amount', {entityPath: 'finance'})}
  </Panel>
)


class SmartUserFinance extends Component {
  componentWillMount() {
    const {id, load} = this.props;
    // Et voila un load !
    load({id});
  }

  render() {
    const {fieldFor, list} = this.props;
    return (
        <User fieldFor={fieldFor} listFor={list} { ...this.props}/>
    );
  }
};

SmartUserFinance.displayName = 'SmartUser ';

const formConfig = {
  formKey: 'userForm',
  entityPathArray: ['user','finance'],
  loadAction: loadUserFinanceAction,
  saveAction: saveUserFinanceAction,
  nonValidatedFields: ['user.firstName']
};

const ConnectedUserForm = compose(
  connectToMetadata(['user', 'financialMove', 'finance']),
  connectToForm(formConfig),
  connectToFieldHelpers()
)(SmartUserFinance );

export default ConnectedUserForm;
