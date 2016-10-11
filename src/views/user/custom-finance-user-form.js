import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadFinanceAction, saveFinanceAction} from '../../actions/finance-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

//import {selectData} from 'focus-graph/store/create-store'
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import FinancialMoveLine from './financialMoveLine'

import ScrollSpyContainer from 'focus-components/scrollspy-container';

const actions = {
  primary: [
    {icon: 'face', label: 'face', action: () => console.log('User Form')},
    {icon: 'card_travel', label: 'card_travel', action: () => console.log('User Form')}
  ],
  secondary: [
    {label: 'Informations', action: () => console.log('User Form')},
    {label: 'Settings', action: () => console.log('User Form')}
  ]
}

const User = ({fieldFor, ...otherProps}) => (
  <Panel title='User' {...otherProps}>
    {fieldFor('uuid', {entityPath: 'user'})}
    {fieldFor('firstName', {entityPath: 'user'})}
    {fieldFor('lastName', {entityPath: 'user'})}
  </Panel>
)

const Finance = ({fieldFor,listFor, rawInputValue, success, fail,  ...otherProps}) => (
  <Panel title={success ? "Finance " +success : "Finance " + fail} {...otherProps}>
    {fieldFor('name', {entityPath: 'finance'})}
    {fieldFor('amount', {entityPath: 'finance'})}
    {fieldFor('date', {entityPath: 'finance'})}
    {fieldFor('test', {entityPath: 'finance'})}
  </Panel>
)

const selectData = name => (state ={}) => {
  if( !state.customData[name]) {
    console.warn(`SELECT_DATA : there is no ${name} in the dataset of the state`)
    return state.customData;
  }
  return state.dataset[name]
}

class SmartUser extends Component {
  componentWillMount() {
    const {id, load} = this.props;
    // Et voila un load !
    load({id});
  }

  render() {
    const {fieldFor, list} = this.props;
    return (
      <User fieldFor={fieldFor} { ...this.props}/>
    );
  }
};
SmartUser.displayName = 'SmartUser';

class SmartFinance extends Component {
  componentWillMount() {
    const {id, load, injectActionHeader, triggerPosition} = this.props;
    // Et voila un load !
    load({id});
    injectActionHeader(actions);
    triggerPosition(0);
  }

  render() {
    const {fieldFor, list} = this.props;
    return (
      <Finance fieldFor={fieldFor} listFor={list} { ...this.props}/>
    );
  }
};
SmartFinance.displayName = 'SmartFinance';

const formConfigUser = {
  formKey: 'userFinanceForm',
  entityPathArray: ['user'],
  loadAction: loadFinanceAction,
  saveAction: saveFinanceAction,
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const formConfigFinance = {
  formKey: 'userFinanceForm2',
  entityPathArray: ['finance'],
  loadAction: loadFinanceAction,
  saveAction: saveFinanceAction,
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
  connectToMetadata(['user']),
  connectToForm(formConfigUser),
  connectToFieldHelpers()
)(SmartUser);

const ConnectedFinanceForm = compose(
  connectToMetadata(['financialMove', 'finance']),
  connectToForm(formConfigFinance),
  connectToFieldHelpers(),
  connectToState(selectData('customData'))
)(SmartFinance);



class SmartComponent extends Component {
  render() {
    return (
      <ScrollSpyContainer>
        <ConnectedUserForm { ...this.props}/>
        <ConnectedFinanceForm { ...this.props}/>
      </ScrollSpyContainer>
    );
  }
};
SmartComponent.displayName = 'SmartComponent';

export default SmartComponent;
