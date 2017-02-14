import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';
import AutocompleteSelect from 'focus-components/autocomplete-select';

const data = [
    {
        key: 'NY',
        label: 'New York'
    },
    {
        key: 'PAR',
        label: 'Paris'
    },
    {
        key: 'TOY',
        label: 'Tokyo'
    },
    {
        key: 'BEI',
        label: 'Pékin'
    },
    {
        key: 'LON',
        label: 'Londres'
    },
    {
        key: 'BER',
        label: 'Berlin'
    }
];

const querySearcher = query => {
    const value = data.filter(({key, label}) => label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: value,
                totalCount: value.length
            });
        }, 200);
    });
};

const keyResolver = key => {
    return new Promise((resolve, reject) => {
        data.forEach(element => {
            if(element.key === key) {
                setTimeout(resolve.bind(this, element.label), 10);
            }
        });
    });
}

const AutoComplete = ({editing, rawInputValue, onChange, onInputBlurError, ...otherProps}) => {
    return(
        <AutocompleteSelect
            editing={editing}
            keyResolver={keyResolver}
            onChange={onChange}
            onInputBlurError={onInputBlurError}
            querySearcher={querySearcher}
            rawInputValue={rawInputValue}
            {...otherProps}
            />
    )
}

const actions = {
    primary: [
        {icon: 'face', label: 'face', action: () => console.log('User Form')},
        {icon: 'event', label: 'event', action: () => console.log('User Form')}
    ],
    secondary: [
        {label: 'Informations', action: () => console.log('User Form')},
        {label: 'Settings', action: () => console.log('User Form')}
    ]
}

class User extends Component {
    componentWillMount() {
        const {id, load, clear, loadMasterData, injectActionHeader, triggerPosition, toggleEdit} = this.props;
        // Et voilà un load !
        if(id) {
            load({id});
        } else {
            clear({isActive: true});
        }
        loadMasterData();
        triggerPosition(0);
        injectActionHeader(actions);
        console.log('PROPS', this.props);
    }

    render() {
        const {fields, listFor, fieldFor, selectFor} = this.props;
        const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid')}
                {selectFor('sexe', {entityPath: 'user', masterDatum: 'sexe'})}
                {selectFor('civility', {entityPath: 'user', masterDatum: 'civility', hasUndefined: true})}
                {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('firstName', {entityPath: 'user'})}
                {civilityField && civilityField.rawInputValue === 'MRS' && fieldFor('lastName', {entityPath: 'user'})}
                {fieldFor('firstName', {metadata: {InputComponent: AutoComplete}})}
                {fieldFor('accountsNames')}
                {fieldFor('date')}
            </Panel>
        );
    }
};

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidateFields: ['lastName'],
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sexe']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(User);

export default ConnectedUserForm;
