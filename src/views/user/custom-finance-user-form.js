import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';

import {selectData} from 'focus-graph/store/create-store'
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';
import Panel from 'focus-components/panel';

import compose from 'lodash/flowRight';

import {loadFinanceAction, saveFinanceAction} from '../../actions/finance-actions';
import FinancialMoveLine from './financialMoveLine'

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

const User = ({fieldFor,listFor, victoire, echec, ...otherProps}) => (
    <Panel title={victoire ? "User " +victoire : "User " + echec} {...otherProps}>
        {fieldFor('name', {entityPath: 'finance'})}
        {fieldFor('amount', {entityPath: 'finance'})}
        {listFor('moves', { redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
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
    formKey: 'userFinanceForm',
    entityPathArray: ['user'],
    loadAction: loadFinanceAction,
    saveAction: saveFinanceAction,
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
    //connectToState(selectData('customData'))
    connectToMetadata(['user', 'financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUserFinance);

class SmartComponent extends Component {
    render() {
        return (
            <ConnectedUserForm {...this.props}/>
        );
    }
};
SmartComponent.displayName = 'SmartComponent';

export default SmartComponent;
