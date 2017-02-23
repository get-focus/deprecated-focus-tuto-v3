import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import FinancialMoveLine from '../financialMoveLine'

const Finance = ({fieldFor, listFor, ...otherProps}) => (
    <Panel title='Finance' {...otherProps}>
        {fieldFor('name')}
        {fieldFor('amount')}
        {listFor('moves', {redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
    </Panel>
)

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

export default SmartFinance;
