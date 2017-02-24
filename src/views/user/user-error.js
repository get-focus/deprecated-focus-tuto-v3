import React, {PureComponent, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import Panel from 'focus-components/panel';

import {loadErrorUserAction, saveErrorUserAction} from '../../actions/user-actions-global-error';

class UserErrors extends PureComponent {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        load({id});
        loadMasterData();
    }
    componentWillReceiveProps(nextProps){
      console.log(nextProps.error)
    }
    render() {
        const {fieldFor, selectFor, ...otherProps} = this.props;
        return (
            <Panel title='User and address' {...this.props}>
                {fieldFor('uuid')}
                {fieldFor('firstName')}
                {fieldFor('lastName')}
                {selectFor('sex', {masterDatum: 'sex'})}
            </Panel>
        );
    }
};

UserErrors.displayName = 'UserErrors';

const formConfig = {
    formKey: 'userAndAddressForm',
    entityPathArray: ['user'],
    loadAction: loadErrorUserAction,
    saveAction: saveErrorUserAction
};

const ConnectedUserErrors = compose(
    connectToMetadata(['user']),
    connectToMasterData(['sex']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserErrors);

export default ConnectedUserErrors;
