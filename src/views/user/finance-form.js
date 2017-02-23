import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadFinanceAction, saveFinanceAction} from '../../actions/finance-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';
import FinancialMoveLine from './financialMoveLine'

const Finance = ({fieldFor,listFor, ...otherProps}) => (
    <Panel title='Finance ' {...otherProps}>
        {fieldFor('name')}
        {fieldFor('amount')}
        {listFor('moves', {redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
    </Panel>
)

class SmartFinance extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }

    render() {
        const {fieldFor, listFor} = this.props;
        return (
            <div>
                <p>
                    Formulaire classique avec une liste éditable (listFor) pour le champs opérations sur le compte.
                </p>
                <Finance fieldFor={fieldFor} listFor={listFor} { ...this.props}/>
            </div>
        );
    }
};

Finance.displayName = 'SmartFinance ';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['finance'],
    loadAction: loadFinanceAction,
    saveAction: saveFinanceAction
};

const ConnectedFinanceForm = compose(
    connectToMetadata(['financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartFinance);

export default ConnectedFinanceForm;
