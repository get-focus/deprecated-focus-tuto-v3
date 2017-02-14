import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';

import Panel from 'focus-components/panel';
import {compose} from 'redux';

import moment  from 'moment';

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

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().toISOString()
        }
    }

    componentWillMount() {
        const {id, load} = this.props;
        load({id});
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
        const {date, error1} = this.state;

        return (
            <div>
                <p>Formulaire affichant différents composants. Ce formulaire permet de tester les composants Checkbox, Date et Autocomplete.</p>
                <Panel title='User Ref List Checkbox' {...this.props}>
                    {fieldFor('uuid', {entityPath: 'user'})}
                    {fieldFor('style')}
                    {fieldFor('accountsNames', {masterDatum: 'accountsNames'})}
                    {fieldFor('date')}
                </Panel>
            </div>
        );
    }
};

const formConfig = {
    formKey: 'userCheckListForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['accountsNames']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
