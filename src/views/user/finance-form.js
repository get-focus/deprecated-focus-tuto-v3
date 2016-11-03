import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadFinanceAction, saveFinanceAction} from '../../actions/finance-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';
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

const Finance = ({fieldFor,listFor, ...otherProps}) => (
    <Panel title='Finance List' {...otherProps}>
        {listFor('moves', {entityPath : 'finance', redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine, isRaw: true})}
    </Panel>
)


class SmartFinance extends Component {
    componentWillMount() {
        const {id, load, injectActionHeader, triggerPosition} = this.props;
        load({id});
        triggerPosition(60);
        injectActionHeader(actions);
    }

    render() {
        const {fieldFor, listFor} = this.props;
        return (
            <Finance fieldFor={fieldFor} listFor={listFor} { ...this.props}/>
        );
    }
};

Finance.displayName = 'SmartFinance';

const formConfig = {
    formKey: 'financeForm',
    entityPathArray: ['finance'],
    loadAction: loadFinanceAction,
    saveAction: saveFinanceAction,
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedFinanceForm = compose(
    connectToMetadata(['financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartFinance );

export default ConnectedFinanceForm;
