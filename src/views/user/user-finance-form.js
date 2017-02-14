import React, {Component} from 'react';
import find from 'lodash/find';

import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';

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

class UserFinanceForm extends Component {
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
                    {selectFor('civility', {entityPath: 'user', masterDatum: 'civility', hasUndefined: true})}
                    {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('firstName', {entityPath: 'user'})}
                    {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('lastName', {entityPath: 'user'})}
                    {fieldFor('lastName', {entityPath: 'user'})}
                    {fieldFor('firstName', {entityPath: 'user'})}
                    {fieldFor('date', {entityPath: 'user'})}
                    {fieldFor('name', {entityPath: 'finance'})}
                    {fieldFor('amount', {entityPath: 'finance'})}
                </Panel>
            </div>
        );
    }
};

UserFinanceForm.displayName = 'UserFinanceForm';

const formConfig = {
    formKey: 'userFinanceForm',
    entityPathArray: ['user', 'address', 'finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction,
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
    connectToMetadata(['user', 'finance']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserFinanceForm);

export default ConnectedUserForm;
