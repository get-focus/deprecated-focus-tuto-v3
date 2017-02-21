import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import FinancialMoveLine from './financialMoveLine'
import ScrollSpyContainer from 'focus-components/scrollspy-container';

const User = ({fieldFor, selectFor, fields, ...otherProps}) => {
    return(
        <Panel title='User' {...otherProps}>
            {fieldFor('uuid')}
            {fieldFor('firstName')}
        </Panel>
    )
}

const Finance = ({fieldFor, listFor, ...otherProps}) => (
    <Panel title='Finance' {...otherProps}>
        {fieldFor('name', {entityPath: 'finance'})}
        {fieldFor('amount', {entityPath: 'finance'})}
        {listFor('moves', {redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
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
        const {id, load, loadMasterData} = this.props;
        // Et voila un load !
        load({id});
    }
    render() {
        const {fieldFor, list} = this.props;
        return (
            <User fieldFor={fieldFor} {...this.props}/>
        );
    }
};

SmartUser.displayName = 'SmartUser';

class SmartFinance extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        // Et voila un load !
        load({id});
    }
    render() {
        const {fieldFor, list} = this.props;
        return (
            <Finance fieldFor={fieldFor} listFor={list} {...this.props}/>
        );
    }
};

SmartFinance.displayName = 'SmartFinance';

const formConfigUser = {
    formKey: 'userFinanceForm',
    entityPathArray: ['user'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const formConfigFinance = {
    formKey: 'userFinanceForm2',
    entityPathArray: ['finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sexe']),
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
                <ConnectedUserForm {...this.props}/>
                <ConnectedFinanceForm {...this.props}/>
            </ScrollSpyContainer>
        );
    }
};

SmartComponent.displayName = 'SmartComponent';
export default SmartComponent;
