import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';

import moment  from 'moment';

const actions = {
    primary: [
        {icon: 'face', label: 'face', action: () => console.log('User Form')},
        {icon: 'keyboard_voice', label: 'keyboard_voice', action: () => console.log('User Form')}
    ],
    secondary: [
        {label: 'Informations', action: () => console.log('User Form')},
        {label: 'Settings', action: () => console.log('User Form')}
    ]
}

const _querySearcher = query => {
    let data = [
        {
            key: 'JL',
            label: 'Joh Lickeur'
        },
        {
            key: 'GK',
            label: 'Guénolé Kikabou'
        },
        {
            key: 'YL',
            label: 'Yannick Lounivis'
        }
    ];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: data.length
            });
        }, 500);
    });
};

const _querySearcher2 = query => {
    let data = [];
    if(data.length == 0) {
        data =  [
            {
                key: 'ERR',
                label: 'Oops, no data to show here...'
            }
        ];
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data,
                totalCount: data.length
            });
        }, 500);
    });
};

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date1: moment().toISOString()
        }
    }

    componentWillMount() {
        const {id, load, loadMasterData, injectActionHeader, triggerPosition} = this.props;
        load({id});
        loadMasterData();
        injectActionHeader(actions);
        triggerPosition(0);
    }

    changeHandler = id => {
        return value => {
            const {isValid, message} = this.refs[`date${id}`].validate();
            this.setState({
                [`date${id}`]: value,
                [`error${id}`]: isValid ? null : message
            });
        }
    }

    render() {
        const {fields, fieldFor, selectFor} = this.props;
        const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
        const {date1, error1} = this.state;
        /*
        <InputDate
        error={error1}
        format={['DD/MM/YYYY', 'DD.MM.YYYY', 'DD MMM YYYY']}
        locale='fr'
        name='date1'
        onChange={this.changeHandler(1)}
        ref='date1'
        value={date1}
        />
        <Autocomplete
        isEdit={true}
        querySearcher={_querySearcher}
        placeholder={'Your search...'}
        onChange={(value) => console.log(value)}
        />
        <Autocomplete
        isEdit={true}
        querySearcher={_querySearcher2}
        placeholder={'Custom dropdown failed results...'}
        />
        </Panel>
        */
        return (
            <div>
                <p>Formulaire affichant différents composants. Ce formulaire permet de tester les composants, checkbox et date.</p>
                <Panel title='User Ref List Checkbox' {...this.props}>
                    {fieldFor('uuid', {entityPath: 'user'})}
                    {fieldFor('style', {entityPath: 'user'})}
                    {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
                    {fieldFor('accountsNames', {entityPath: 'user'})}
                    {fieldFor('date', {entityPath: 'user'})}
                </Panel>
            </div>
        );
    }
};

const formConfig = {
    formKey: 'userCheckListForm',
    entityPathArray: ['user', 'address'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    mapDispatchToProps: {injectActionHeader, triggerPosition}
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
