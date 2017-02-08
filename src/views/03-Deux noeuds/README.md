# Les actions Builders avec deux nœuds

Il est possible, de manière très simple, d'ajouter deux nœuds à une actionBuilder afin de charger deux entités lors d'un seul service.

```jsx
//actions/finance-user-actions.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUserFinance, saveUserFinance} from '../services/user-finance-service';

const _loadUserFinanceAction = actionBuilder({names: ['user', 'finance' ], type: 'load', service: loadUserFinance});

export const loadUserFinanceAction = _loadUserFinanceAction.action;
export const loadUserFinanceTypes = _loadUserFinanceAction.types;
const _saveUserFinanceAction = actionBuilder({names: ['user','finance'], type: 'save', service: saveUserFinance});

export const saveUserFinanceAction = _saveUserFinanceAction.action;
export const saveUserFinanceTypes = _saveUserFinanceAction.types;
```

Comme nous pouvons le remarquer, nous avons mis deux nœuds dans le tableaux names : 'user' et 'finance'. Notre serveur nous renvoyant les informations d'un user et l'objet finance avec les deux noms des nœuds comme clé.

Exemple d'objet envoyé par le serveur.
```json
{
   "user": {
      "uuid":"120",
      "firstName":"Kian",
      "lastName":"Stroman"
   },
   "finance": {
      "name":"Personal Loan Account",
      "amount":"157.00",
      "currency":"European Unit of Account 9(E.U.A.-9)",
      "moves": [
          {
            "transactionType":"withdrawal",
            "amount":"971.00"
         },
         {
            "transactionType":"payment",
            "amount":"838.00"
         }
      ]
   }
}
```

Une question se pose concernant le reducer : *Quand on regarde plus en détail ce que l'actionBuilder renvoie, on se rend compte qu'il y a en effet : une action et six types différents. Pourquoi ?*
L'actionBuilder permet d'avoir un load pour deux entités, c'est l'action que vous pourrez donner dans votre formulaire ! Pour les types, pas de panique c'est normal, vous avez deux entités, et donc six actions au sens redux du terme, vous avez alors six types pour votre reducer. Ainsi si vous avez suivi le superbe tutoriel depuis le début vous avez déjà un reducer pour le nœud finance, et un autre pour le nœud user. Ainsi vous n'avez besoin que de l'action pour votre vue.
Sinon je propose ces petits reducers (et n'oubliez pas d'exporter vos types en retour de l'action) :

```jsx
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserFinanceTypes, saveUserFinanceTypes} from '../actions/finance-user-actions';

// Récupération des types des trois actions redux créé par l'actionBuilder
const {REQUEST_LOAD_FINANCE, RESPONSE_LOAD_FINANCE, ERROR_LOAD_FINANCE} = loadUserFinanceTypes;

// Récupération des types des trois actions redux créé par l'actionBuilder
const {REQUEST_SAVE_FINANCE, RESPONSE_SAVE_FINANCE, ERROR_SAVE_FINANCE} = saveUserFinanceTypes;

// Récupération des types des trois actions redux créé par l'actionBuilder
const {REQUEST_LOAD_USER, RESPONSE_LOAD_USER, ERROR_LOAD_USER} = loadUserFinanceTypes;

// Récupération des types des trois actions redux créé par l'actionBuilder
const {REQUEST_SAVE_USER, RESPONSE_SAVE_USER, ERROR_SAVE_USER} = saveUserFinanceTypes;

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Amélie'
};

// Utilisation du reducerBuilder qui attends le type des trois actions créés par l'actionBuimlder
export const financeReducer = reducerBuilder({
  name: 'finance',
  loadTypes: {REQUEST_LOAD_FINANCE, RESPONSE_LOAD_FINANCE, ERROR_LOAD_FINANCE},
  saveTypes: {REQUEST_SAVE_FINANCE, RESPONSE_SAVE_FINANCE, ERROR_SAVE_FINANCE}
});

export const userReducer = reducerBuilder({
	name: 'user',
    saveTypes: {REQUEST_SAVE_USER, RESPONSE_SAVE_USER, ERROR_SAVE_USER},
    loadTypes : {REQUEST_LOAD_USER, RESPONSE_LOAD_USER, ERROR_LOAD_USER},
    defaultData: DEFAULT_DATA
});
```

Sans oublier de les ajouter dans le combineReducer :
```jsx
import {combineReducers} from 'redux';
import {userReducer, financeReducer} from './user-finance-reducer'

export default combineReducers({
    user : userReducer,
    finance : financeReducer
});
```

Nous sommes fin prêts à mettre en place notre formulaire à deux nœuds :

```jsx
//views/user/user-finance-form.js
import React, {Component, PropTypes} from 'react';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import Panel from 'focus-components/panel';

import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';

import compose from 'lodash/flowRight';
import FinancialMoveLine from './financialMoveLine'

const User = ({fieldFor,listFor, ...otherProps}) => (
    <Panel title='User' {...otherProps}>
        {fieldFor('uuid', {entityPath: 'user'})}
        {fieldFor('firstName', {entityPath: 'user'})}
        {fieldFor('lastName', {entityPath: 'user'})}
        {fieldFor('name', {entityPath: 'finance'})}
        {fieldFor('amount', {entityPath: 'finance'})}
    </Panel>
)

class SmartUserFinance extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        // Et voila un load !
        load({id});
    }

    render() {
        const {fieldFor, list} = this.props;
        return (
            <div>
                <p>Formulaire à deux noeuds. Ce formulaire charge le deux entités 'user' et 'finance' lors d'un seul service.</p>
                <User fieldFor={fieldFor} listFor={list} { ...this.props}/>
            </div>
        );
    }
};

SmartUserFinance.displayName = 'SmartUser';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user','finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction,
    nonValidatedFields: ['user.firstName']
};

const ConnectedUserForm = compose(
    connectToMetadata(['user', 'financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUserFinance );

export default ConnectedUserForm;
```

Voici ce qu'on obtient :
![image](https://cloud.githubusercontent.com/assets/8124804/22733989/5cd3b478-edf4-11e6-8e96-071850c004e5.png)

---

[Prochaine partie : les middlewares](../04-Les%20middlewares/)
