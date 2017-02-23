import React, {Component, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import Panel from 'focus-components/panel';

import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';

const User = ({fieldFor,listFor, ...otherProps}) => (
    <Panel title='User Finance' {...otherProps}>
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
        load({id});
    }

    render() {
        const {fieldFor, list} = this.props;
        return (
            <div>
                <p>Formulaire à deux noeuds. Ce formulaire charge le deux entités 'user' et 'finance' lors d''un seul service.</p>
                <User fieldFor={fieldFor} listFor={list} {...this.props}/>
            </div>
        );
    }
};

SmartUserFinance.displayName = 'SmartUser';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user','finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction,
    nonValidatedFields: ['user.firstName']
};

const ConnectedUserForm = compose(
    connectToMetadata(['user', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUserFinance);

export default ConnectedUserForm;
