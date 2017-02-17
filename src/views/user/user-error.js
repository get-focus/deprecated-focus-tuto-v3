import React, {PureComponent, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import Panel from 'focus-components/panel';

import {loadUserErrorAction, saveErrorUserAction, saveUserAction} from '../../actions/user-actions-global-error';

class UserErrors extends PureComponent {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }
    componentWillReceiveProps(nextProps){
      console.log(nextProps.error)
    }
    render() {
        const {editing, fields, fieldFor, listFor, selectFor} = this.props;
        return (
            <Panel title='User and address' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user'})}
                {fieldFor('firstName', {entityPath: 'user'})}
            </Panel>
        );
    }
};

UserErrors.displayName = 'UserErrors';

const formConfig = {
    //todo: it should raise an error if i use the same formKey.
    formKey: 'userAndAddressForm',
    entityPathArray: ['user'],
    loadAction: loadUserErrorAction,
    saveAction: saveErrorUserAction
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserErrors = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserErrors);

export default ConnectedUserErrors;
