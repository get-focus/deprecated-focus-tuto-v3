import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm} from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import ScrollSpyContainer from 'focus-components/scrollspy-container';

import {ConnectedUserForm} from './custom-finance-user/custom-user-form'
import {ConnectedFinanceForm} from './custom-finance-user/custom-finance-form'

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
