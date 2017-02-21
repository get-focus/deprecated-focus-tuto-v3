# Les erreurs globales

Nous allons maintenant générer une erreur globale. Les erreurs globales sont un tableau de 'string' renvoyé par le serveur. Chaque élément du tableau correspondant à un message d'erreur.

Il y a alors quatre étapes pour réaliser cela :
- la vue,
- les services,
- les actions,
- les reducers

Il faut créer les domaines dans 'domains.index.js' qui permettent de définir des règles que nous appliquerons sur les champs de notre formulaire. Normalement plus de difficultés arrivé à ce niveau là.

Nous allons appliquer ces domaines dans les entity-definitions. Encore une fois il ne devrait pas y avoir de problème à être autonome là-dessus.

## La vue

Nous allons créer un composant React appelé User.

```jsx
// views/user/user-error.js
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
                {fieldFor('uuid')}
                {fieldFor('firstName')}
                {fieldFor('lastName')}
            </Panel>
        );
    }
};

UserErrors.displayName = 'UserErrors';

const formConfig = {
    //todo: it should raise an error if i use the same formKey.
    formKey: 'userAndAddressForm',
    entityPathArray: ['user'],
    loadAction: loadErrorUserAction,
    saveAction: saveErrorUserAction
};

//Connect the component to all its behaviours (respect the order for store, store -> props, helper)
const ConnectedUserErrors = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(UserErrors);

export default ConnectedUserErrors;
```

## Les services

```jsx
// services/index.js
import focusFetch from 'focus-application/fetch/fetch-proxy'

export const loadUser = async ({id}) => {
    return focusFetch({url: `http://localhost:9999/x/users/${id}`, method: 'GET'}).then((data) => {
        return {
            ...data.user,
            __Focus__updateRequestStatus: data.__Focus__updateRequestStatus
        };
    });
}

export const saveUser = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...user};
}

export const loadError = async ({user}) => {
    return focusFetch({url: `http://localhost:9999/x/error`, method: 'GET'}).then((data) => {
        return {
            ...data.user,
            __Focus__updateRequestStatus: data.__Focus__updateRequestStatus,
            __Focus__status: data.__Focus__status,
            globalErrors: data.globalErrors
        };
    });
}
```

## Les actions

Nous avons deux actions à écrire le load et le save. Il est alors possible d'utiliser l'actionBuilder. Nous préconisons l'utilisation de ce dernier, mais ce n'est pas une obligation.

```jsx
// actions/user-actions-global-error.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUser, saveUser, loadError} from '../services';

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _loadErrorUserAction = actionBuilder({names: ['user'], type: 'load', service: loadUser});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const loadErrorUserTypes = _loadErrorUserAction.types;
export const loadErrorUserAction = _loadErrorUserAction.action;

const _saveErrorUserAction = actionBuilder({names: ['user'], type: 'save', service: loadError});
export const saveErrorUserTypes = _saveErrorUserAction.types;
export const saveErrorUserAction = _saveErrorUserAction.action;
```


Et dans index.js, ajoutez :

```jsx
import {initFetch} from './services/fetch';
initFetch(store.dispatch);
```

## Les reducers

```jsx
// reducer/user-error-reducer.js
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadErrorUserTypes,saveErrorUserTypes} from '../actions/user-actions-global-error';

// Données initiales pour la state redux
const DEFAULT_DATA = {
    firstName:'Amélie'
};

// Utilisation du reducerBuilder qui attend un name correspondant à votre entité, puis les types de load renvoyés par les actions
// mais aussi les types des saves et enfin les defaultData.
const userErrorReducer = reducerBuilder({
    name: 'user',
    loadTypes: loadErrorUserTypes,
    saveTypes: saveErrorUserTypes,
    defaultData: DEFAULT_DATA
});

export default userErrorReducer;
```

```jsx
// reducer/index.js
import {combineReducers} from 'redux';
import userErrorReducer from './user-error-reducer';

export default combineReducers({
    user : userErrorReducer
});

Il faut maintenant connecter la vue créée au router en important celle-ci dans le fichier router et en précisant le chemin amenant à notre vue.

```jsx
// router/index.js
import UserError from '../views/user/user-error';

// ...votre code...
        <Route path='users/error/:id' component={({params}) => <UserError id={params.id}/>} />
// ...votre code...
```

Et enfin modifier le fichier home pour afficher notre carte menant vers la vue du formulaire.

```jsx
// home.js
// ...votre code...
    {route: '/users/error/120', destination: 'Error', description: 'Composant user avec une error', title: 'Error'}
// ...votre code...
```

![image](https://cloud.githubusercontent.com/assets/8124804/23126393/b91fb8ae-f776-11e6-8dd8-30cf29c2fb54.png)
