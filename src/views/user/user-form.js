import React, {Component, PropTypes} from 'react';
import {compose} from 'redux';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';
// Les boutons de save et de load sont maintenant portés par le panel
import Panel from 'focus-components/panel';

import {loadUserAction, saveUserAction} from '../../actions/user-actions';

const User = ({fieldFor, selectFor, ...otherProps}) => (
    <Panel title='User' {...otherProps}>
        {fieldFor('uuid', {entityPath: 'user'})}
        {fieldFor('firstName', {entityPath: 'user'})}
        {fieldFor('lastName', {entityPath: 'user'})}
        {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
        {fieldFor('sex', {entityPath: 'user'})}
    </Panel>
)

class SmartUser extends Component {
    componentWillMount() {
        const {id, load, loadMasterData, injectActionHeader, triggerPosition} = this.props;
        // Et voilà un load !
        load({id});
        loadMasterData();
        triggerPosition(0);
    }

    render() {
        const {fieldFor, selectFor} = this.props;
        /*    const {fieldFor, selectFor} = this.props;
        return (
        <Panel title='User' {...this.props}>
        {fieldFor('uuid')}
        {fieldFor('firstName')}
        {fieldFor('lastName')}
        {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
        {fieldFor('sex')}
        </Panel>
        );*/
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

// FormKey : Elle doit être unique pour chaque Form, elle nous permet d'avoir un discrinant !
// Définit les définitions relatives au form en question, vous pouvez en mettre autant que vous voulez !
// LoadAction, elle porte bien son nom ! Elle se trouve maintenant dans les props sous le nom de .... load
// SaveAction, elle porte également très bien sont nom et se trouve également dans les props sont le nom de ... save !!
// nonValidatedFields : tableau qui permet de ne pas prendre en compte un champs required d'une définition
const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);

//Attention de toujours exporter le composant connecté
export default ConnectedUserForm;
