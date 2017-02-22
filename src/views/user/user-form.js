import React, {PureComponent, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import Panel from 'focus-components/panel';

import {loadUserAction, saveUserAction} from '../../actions/user-actions';

const User = ({fieldFor, selectFor, ...otherProps}) => (
    <Panel title='User' {...otherProps}>
        {fieldFor('uuid')}
        {fieldFor('lastName')}
        {fieldFor('firstName')}
        {selectFor('civility', {masterDatum: 'civility'})}
        {selectFor('sex', {masterDatum: 'sex'})}
    </Panel>
)

class SmartUser extends PureComponent {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        // Et voilà un load !
        load({id});
        loadMasterData();
    }

    render() {
        const {fieldFor, selectFor} = this.props;
        return (
            <div>
                <p>Formulaire classique avec liste de référence. Ce formulaire modifiable affiche une liste de champs input.
                    <br/>
                    Le champs civilité est une liste de référence. Le champs sexe est une radio list.
                </p>
                <User fieldFor={fieldFor} selectFor={selectFor} { ...this.props}/>
            </div>
        );
    }
};

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sex']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);

export default ConnectedUserForm;
