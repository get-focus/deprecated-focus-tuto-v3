import React, {PureComponent, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import Panel from 'focus-components/panel';

import {loadUserAction, saveErrorUserAction} from '../../actions/user-actions-global-error';

const User = ({fieldFor, selectFor, ...otherProps}) => (
    <Panel title='User' {...otherProps}>
        {fieldFor('uuid')}
        {fieldFor('lastName')}
        {fieldFor('firstName')}
    </Panel>
)

class SmartUser extends PureComponent {
    componentWillMount() {
        const {id, load} = this.props;
        // Et voilà un load !
        load({id});
    }

    render() {
        const {fieldFor, selectFor} = this.props;
        return (
            <div>
                <p>Formulaire classique avec erreur globale.</p>
                <User fieldFor={fieldFor} selectFor={selectFor} {...this.props}/>
            </div>
        );
    }
};

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveErrorUserAction
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);

export default ConnectedUserForm;
