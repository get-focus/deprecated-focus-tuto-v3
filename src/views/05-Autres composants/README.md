# Utilisation d'autres composants

Cette partie s'intéresse à mettre en musique d'autres composants de formulaires.

Le formulaire créé affichera comme nouveaux composants :
- un champ [date](https://github.com/get-focus/focus-components/tree/develop/src/input-date),
- un champ [select checkbox](https://github.com/get-focus/focus-components/tree/develop/src/select-checkbox),
- un champ [autocomplete](https://github.com/get-focus/focus-components/blob/develop/src/autocomplete-text/field.js)

Si vous avez fait les parties précédentes, vous devriez avoir déjà une bonne partie du code de prêt.

## Domains, entity-definitions et master-datas

Il faut importer à partir de focus-component les nouveaux composants que nous allons utiliser et définir des domaines qui vont les utiliser.

```jsx
// domains/index.js
import React, {Component, PropTypes} from 'react';

import Checkbox from 'focus-components/input-checkbox';
import Radio from 'focus-components/input-radio';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';
import Autocomplete from 'focus-components/autocomplete-text/edit';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
}

export const DO_SYMBOL = {
    type: 'text'
}

export const DO_CODE = {
    type: 'text'
}

export const DO_MONTANT = {
    type: 'number'
}

export const DO_DATE = {
    type: 'text',
    InputComponent: InputDate
}

export const DO_CIVILITE = {
    type: 'text',
    validators: [{
        type: 'string',
        options: {
            maxLength: 200
        }
    }],
    SelectComponent: InputSelect
}

export const DO_SEXE = {
    SelectComponent: RadioSelect
}

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
   InputComponent: props => <div><Autocomplete querySearcher={_querySearcher}/></div>
    //  InputComponent: Autocomplete
}

export const DO_CHECKBOX = {
    type: 'text',
    InputComponent: Checkbox
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
```

```jsx
// entity-definitions.js
export const user = {
    uuid: {
        domain: 'DO_ID',
        isRequired: true
    },
    firstName: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    lastName: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    civility: {
        domain: 'DO_CIVILITE',
        isRequired: true
    },
    sex: {
        domain: 'DO_SEXE',
        isRequired: true
    },
    style: {
        domain: 'DO_CHECKBOX',
        isRequired: true
    },
    accountsNames: {
        domain: 'DO_ACCOUNTS_NAMES',
        isRequired: true
    },
    date: {
        domain: 'DO_DATE',
        isRequired: false
    }
}
```

```jsx
// config/master-datas/index.js
import {loadAccountsNames} from '../../services/load-accounts-names';

export const masterDataConfig  = [
    {
        name: 'accountsNames',
        service: loadAccountsNames
    }
];
```

## La vue

```jsx
// views/user/user-components.js
import React, {Component, PropTypes} from 'react';
import find from 'lodash/find';

import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';

import InputSelect from 'focus-components/select-mdl';

import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';


class UserForm extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        load({id});
    }

    render() {
        const { fields, fieldFor, selectFor} = this.props;
        const civilityField = find(fields, {name: 'civility', entityPath: 'user'});
        return (
            <Panel title='User Ref List Checkbox' {...this.props}>
                {fieldFor('uuid')}
                {fieldFor('style')}
                {fieldFor('accountsNames', {masterDatum: 'accountsNames'})}
                {fieldFor('date')}
            </Panel>
        );
    }
};

UserForm.displayName = 'UserForm';

const formConfig = {
    formKey: 'userComponentsListForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName', 'user.accountsNames']
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserForm);

export default ConnectedUserForm;
```

## Les actions

Nous avons deux actions à écrire le load et le save. Il est alors possible d'utiliser l'actionBuilder. Nous préconisons l'utilisation de ce dernier, mais ce n'est pas une obligation.

```jsx
// actions/user-actions.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUser, saveUser} from '../services';

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _loadUserAction = actionBuilder({names: ['user' ], type: 'load', service: loadUser});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const loadUserTypes = _loadUserAction.types;
export const loadUserAction = _loadUserAction.action;

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _saveUserAction = actionBuilder({names: ['user'], type: 'save', service: saveUser});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const saveUserTypes = _saveUserAction.types;
export const saveUserAction = _saveUserAction.action;
```

## Les services

```jsx
// services/index.js
import focusFetch from 'focus-application/fetch/fetch-proxy'

export const loadUser = async ({id}) => {
    const response = await focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'})
    const data = await response;
    return {...data.user, __Focus__updateRequestStatus: data.__Focus__updateRequestStatus};
}

export const saveUser = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...user};
}
```

```jsx
// services/load-accounts-names.js
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
export const loadAccountsNames = () => Promise.resolve(data, totalCount: data.length);
```

## Les reducers

```jsx
// reducer/index.js
import {combineReducers} from 'redux';
import {userReducer} from './user-reducer'

export default combineReducers({
    user: userReducer
});
```

```jsx
// reducer/user-reducer.js
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserTypes, saveUserTypes} from '../actions/user-actions';

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Amélie'
};

// Utilisation du reducerBuilder qui attend un name correspondant à votre entité, puis les types de load renvoyés par les actions
// mais aussi les types des saves et enfin les defaultData.
const userReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadUserTypes,
    saveTypes: saveUserTypes,
    defaultData: DEFAULT_DATA
});

export default userReducer;
```

## Les routes

```jsx
// router/index.js
import UserComponent from '../views/user/user-components';

// ...votre code...

        <Route path='users/component/:id' component={({params}) => <UserComponent id={params.id}/>} />
```

Ajoutez la carte menant au formulaire sur la page d'accueil :

```jsx
// views/home.js

// ...votre code...

    {route: '/users/component/120', destination: 'user components', description: 'Formulaire avec différents composants', title: 'User Components'}
```

Voici à quoi ressemble votre formulaire en mode édition :

![image](https://cloud.githubusercontent.com/assets/8124804/22969519/14d766a8-f36f-11e6-8e47-abfc74b2854b.png)

---

[Prochaine partie : les erreus globales](../06-Erreurs globales/)
