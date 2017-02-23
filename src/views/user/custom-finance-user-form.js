import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import ScrollSpyContainer from 'focus-components/scrollspy-container';

import SmartUser from './custom-finance-user/custom-user-form'
import SmartFinance from './custom-finance-user/custom-finance-form'

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

const selectData = name => (state ={}) => {
    if( !state.customData[name]) {
        console.warn(`SELECT_DATA : there is no ${name} in the dataset of the state`)
        return state.customData;
    }
    return state.dataset[name]
}

const formConfigUser = {
    formKey: 'userFinanceForm',
    entityPathArray: ['user'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sexe']),
    connectToForm(formConfigUser),
    connectToFieldHelpers()
)(SmartUser);

const formConfigFinance = {
    formKey: 'userFinanceForm2',
    entityPathArray: ['finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const ConnectedFinanceForm = compose(
    connectToMetadata(['financialMove', 'finance']),
    connectToForm(formConfigFinance),
    connectToFieldHelpers(),
    connectToState(selectData('customData'))
)(SmartFinance);

SmartComponent.displayName = 'SmartComponent';

export default SmartComponent;
