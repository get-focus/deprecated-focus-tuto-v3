# Les Middlewares

Je vous recommande la documentation de redux : http://redux.js.org/docs/advanced/Middleware.html
qui vous sera d'une grande aide si vous avez un doute sur les middlewares.
N'hésitez pas à relire également la documentation sur le createStoreWithFocus.

Vous voulez avoir, en fonction d'une action, un comportement particulier, une logique autre : le middleware est là pour vous. Nous allons pour cela mettre en place trois middlewares d'exemple :

 - un middleware qui permet lors d'une action de réaliser la même action sur un autre champ
 - un middleware qui permet lors d'une action de réaliser une autre action du form
 - un middleware qui permet lors d'une action de réaliser une autre action que nous avons écrit

## Initialisation

Si ça n'est déjà fait, initialisez vos domains et entity-definitions :

```jsx
// config/domains/index.js
import React, {Component, PropTypes} from 'react';

import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
}

export const DO_AMOUNT = {
    type: 'number'
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
```

```jsx
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
        domain: 'DO_TEXTE',
        isRequired: true
    },
    accountsNames: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    date: {
        domain: 'DO_TEXTE',
        isRequired: false
    }
}

export const finance = {
    name: {
        domain: 'DO_TEXTE',
        isRequired: true
    },
    amount: {
        domain: 'DO_AMOUNT',
        isRequired: true
    },
    moves:{
        redirect: ['financialMove']
    },
    currency: {
        domain: 'DO_SYMBOL',
        isRequired: true
    },
    date: {
        domain: 'DO_DATE',
        isRequired: false
    }
}

export const financialMove = {
    transactionType: {
        domain: 'DO_CODE',
        isRequired: true
    },
    amount: {
        domain: 'DO_MONTANT',
        isRequired: true
    }
}
```

## Middleware de base

Prenons un exemple précis. Lorsqu'un input particulier vient à changer et que ce changement doit mettre en majuscules un autre input (oui oui, ce cas arrive tous les jours), c'est dans le middleware que tout va se jouer.
Pour cela deux étapes :

- Ecrire le middleware :

Vous pouvez créer un dossier middleware et écrire dans notre cas :

```jsx
// middleware/user-middleware.js
import rootReducer from '../reducer';
import createStoreWithFocus, {combineReducerWithFocus} from 'focus-graph/store/create-store';
import {INPUT_CHANGE, INPUT_ERROR} from 'focus-graph/actions/input';

export const amoutToUpperCaseMiddleware = store => next => action => {
    //On récupère les informations que l'on souhaite dans le state Redux
    const {forms, definitions, domains} = store.getState();
    //On recherche l'action souhaitée sur le champs souhaité afin de réaliser notre action
    if (action.type === INPUT_CHANGE && action.fieldName == 'amount') {
        // L'objet action est celui décrit dans les actions [focus-graph](https://github.com/get-focus/focus-graph/blob/master/src/actions/form.js)
        const {formKey} = action;
        const {fields} = forms.find(f=> f.formKey === formKey);
        //On met en forme notre nouvelle action
        const lastNameAction = {...action};
        lastNameAction.fieldName = 'name';
        lastNameAction.rawValue = fields.find(f => f.name == 'name').rawInputValue.toUpperCase();
        //On réalise la première action
        next(action);
        //On dispatch l'action que nous avons créée
        store.dispatch(lastNameAction);
    } else {
        //Dans tous les autres cas d'action, on realise l'action sans modification
        next(action);
    }
}
```
IL est très simple, via les middlewares, de se placer avant ou après une action, afin de réaliser des modifications. Il suffit pour cela de récupérer l'action qui nous intéresse, de créer la nouvelle action, de réaliser la première et enfin de dispatcher l'action créée (qui passera aussi dans les middlewares).

- L'ajouter lors de la création du store :

Pour cette partie, je vous invite à relire la partie sur le store Redux et sur le [createStoreWithFocus](https://github.com/get-focus/focus-tuto-redux/blob/master/README.md#dernier-point-avant-de-se-lancer-on-va-créer-un-store-un-peu-plus-avancé)

```jsx
// store/index.js
import {amoutToUpperCaseMiddleware} from '../../src/middleware/user-middleware';

// ...VOTRE CODE...

const store = createStoreWithFocus(
    {
        dataset: rootReducer,
        header: headerReducer,
        messages: messageReducer,
        confirm: confirmReducer,
        fetch:fetchReducer
    },
    [amoutToUpperCaseMiddleware],
    [DevTools.instrument()]
);
```

> Le tour est joué ! C'est magique non ?

## Middleware, deuxième exemple

Il est également possible de dispatcher une autre action. Il suffit pour cela de réaliser la même chose que précédemment en ajoutant seulement un autre type et en respectant le contract défini par les [actions](https://github.com/get-focus/focus-graph/blob/master/src/actions/form.js) du form. Il est possible de mettre en place toutes actions disponibles du form.

```jsx
// middleware/user-middleware.js
export const errorFieldMiddleware = store => next => action => {
    const {forms, definitions, domains} = store.getState();
    if (action.type === INPUT_CHANGE && action.fieldName == 'amount') {
        const errorAction = {};
        errorAction.type = 'INPUT_ERROR';
        errorAction.formKey = action.formKey;
        errorAction.fieldName = 'name';
        errorAction.entityPath = action.entityPath;
        errorAction.error = "Une erreur venue de l'espace !"
        next(action);
        store.dispatch(errorAction);
    } else {
        next(action);
    }
}
```

sans oublier de l'injecter lors de la construction du store en remplaçant :

```jsx
import {amoutToUpperCaseMiddleware} from '../../src/middleware/user-middleware';
```
par
```jsx
import {amoutToUpperCaseMiddleware, errorFieldMiddleware} from '../../src/middleware/user-middleware';
```

et
```jsx
    [amoutToUpperCaseMiddleware],
```
par
```jsx
 [amoutToUpperCaseMiddleware, errorFieldMiddleware],
```

## Un troisième pour la route !

> En pratique ce troisième cas ne sera pas le plus utilisé, mais c'est toujours bien de savoir que c'est possible. Qui plus est, cela montre d'autant plus la force de redux (au cas où vous ne seriez pas encore convaincu).

Avec focus-graph, un nombre d'actions de base est déjà présent, comme `input_change`, ou le `create_form`. Cependant pour des besoins spécifiques (très spécifiques), il se peut que vous ayez besoin d'avoir une action qui ajoute, modifie une partie du state et qui ne sera pas disponible via le form. Il faut alors écrire cette action. Pour ça, il y a un peu plus d'étapes.

> Attention via cette technique il n'est pas possible de modifier l'objet form (et donc fields) du state, qui ne peut se modifier qu'à travers les actions du form.

- Le middleware :

```jsx
export const ownActiondMiddleware = store => next => action => {
    const {forms, definitions, domains} = store.getState();
    if (action.type === INPUT_CHANGE && action.fieldName == 'name') {
        const customAction = {};
        customAction.type = 'MY_ACTION';
        customAction.formKey = action.formKey;
        next(action);
        store.dispatch(customAction);
    } else {
        next(action);
    }
}
```

Toujours le même principe, au moment de l'action `input_change` sur le `name` on va dispatcher une autre action mais cette fois cela sera une action custom.

Encore une fois, ajoutez les changements dans le store.

- L'action custom :

Une action au sens redux du terme ça, cela ressemble à ça :

```jsx
// actions/custom-actions.js
export const MY_ACTION = 'MY_ACTION';

export const customAction = (formKey) => {
  type: MY_ACTION,
  formKey
}
```

En effet pour les actions spécifiques du load et du save l'actionBuilder est là pour vous simplifier les développements. Cependant, pour des actions "simples", voici ce que vous devez écrire. Une action doit toujours avoir un type, ce type étant le descriminant pour les reducers. Puis elle contient les informations nécessaires au reducer pour transformer le state. Pour cet exemple, la clé du formulaire est suffisant. Maintenant vous pouvez tout aussi bien lui donner autre chose.

```jsx
// actions/finance-user-actions.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUserFinance, saveUserFinance} from '../services';

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _loadUserFinanceAction = actionBuilder({names: ['user', 'finance'], type: 'load', service: loadUserFinance});
export const loadUserFinanceTypes = _loadUserFinanceAction.types;
export const loadUserFinanceAction = _loadUserFinanceAction.action;

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _saveUserFinanceAction = actionBuilder({names: ['user','finance'], type: 'save', service: saveUserFinance});
export const saveUserFinanceTypes = _saveUserFinanceAction.types;
export const saveUserFinanceAction = _saveUserFinanceAction.action;
```

- Le reducer :

De la même façon qu'avec l'action, le reducerBuilder n'est pas utile ici. Cependant il est important de comprendre qu'un reducer agit sur une partie du state et donc vous devrez indiquer ici tout les reducers dont vous avez besoin pour agir sur cette partie du state en particulier, il faudra alors réaliser un switch en fonction des différentes actions disponibles pour cette partie du state. Nous en avons qu'une seule ici, mais il n'est pas exclu d'en avoir plusieurs.

Lorsque l'action MY_ACTION est dipatchée par notre middleware, le reducer va ajouter un message de victoire dans le state, sinon il ajoutera un autre message d'échec... Il faut maintenant ajouter notre reducer dans le combineReducer. C'est à ce moment-là qu'on définira le nœud du store, et donc le nom dans le state. Vous allez voir c'est très simple.

```jsx
// reducer/custom-reducer.js
import {MY_ACTION} from '../actions/custom-actions';

 const customReducer = (state = {}, action) => {
    switch(action.type) {
        case MY_ACTION:
          return {victoire: 'De la Gloire'};
        default:
          return {echec: 'De l\'échec' };
    }
};

export default customReducer;
```

```jsx
// reducer/finance-user-reducer.js
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserFinanceTypes, saveUserFinanceTypes} from '../actions/finance-user-actions';

// Utilisation du reducerBuilder qui attends le type des trois actions créés par l'actionBuimlder
export const financeReducer = reducerBuilder({
  name: 'finance',
  loadTypes: loadUserFinanceTypes,
  saveTypes: saveUserFinanceTypes
});

export const userReducer = reducerBuilder({
    name: 'user',
    loadTypes : loadUserFinanceTypes,
    saveTypes: saveUserFinanceTypes,
});
```

```jsx
// reducer/index.js
import {combineReducers} from 'redux';
import {userReducer, financeReducer} from './finance-user-reducer';

export default combineReducers({
  user: userReducer,
  finance: financeReducer
});
```

> A noter : il est important de se rappeler que le state redux est un objet immutable et ainsi vous devez toujours renvoyer un nouvel objet et non modifier le premier.

- Le combineReducer :

Il vous suffit d'ajouter votre reducer lors de la déclaration de votre store dans le customData :

```jsx
// store/index.js
import customReducer from './custom-reducer'

// --- votre code ---

const store = createStoreWithFocus(
    {
        dataset: rootReducer,
        header: headerReducer,
        messages: messageReducer,
        confirm: confirmReducer,
        customData: customReducer,
        fetch:fetchReducer
    },
```

Et voilà, le tour est joué. Notre information se trouvera donc dans customData.

- Le connecteur :

Un dernier petit effort, c'est presque fini ! Donc maintenant que notre information est dans notre store, il faut récupérer cette information, souvenez-vous de nos amis les connecteurs. Notre vue doit se connecter à cette information du state, on se place alors dans celle-ci en se concentrant sur les connecteurs :

```jsx
// views/user/custom-finance-user-form.js
import React, {Component, PropTypes} from 'react';
import {connect as connectToState} from 'react-redux';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserFinanceAction, saveUserFinanceAction} from '../../actions/finance-user-actions';
import Panel from 'focus-components/panel';
import compose from 'lodash/flowRight';
import FinancialMoveLine from './financialMoveLine'
import ScrollSpyContainer from 'focus-components/scrollspy-container';

const User = ({fieldFor, selectFor, fields, ...otherProps}) => {
    return(
        <Panel title='User' {...otherProps}>
            {fieldFor('uuid')}
            {fieldFor('firstName')}
        </Panel>
    )
}

const Finance = ({fieldFor, listFor, ...otherProps}) => (
    <Panel title='Finance' {...otherProps}>
        {fieldFor('name', {entityPath: 'finance'})}
        {fieldFor('amount', {entityPath: 'finance'})}
        {listFor('moves', { redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
    </Panel>
)

const selectData = name => (state ={}) => {
    if( !state.customData[name]) {
        console.warn(`SELECT_DATA : there is no ${name} in the dataset of the state`)
        return state.customData;
    }
    return state.dataset[name]
}

class SmartUser extends Component {
    componentWillMount() {
        const {id, load, loadMasterData} = this.props;
        // Et voila un load !
        load({id});
    }
    render() {
        const {fieldFor, list} = this.props;
        return (
            <User fieldFor={fieldFor} {...this.props}/>
        );
    }
};

SmartUser.displayName = 'SmartUser';

class SmartFinance extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        // Et voila un load !
        load({id});
    }
    render() {
        const {fieldFor, list} = this.props;
        return (
            <Finance fieldFor={fieldFor} listFor={list} {...this.props}/>
        );
    }
};

SmartFinance.displayName = 'SmartFinance';

const formConfigUser = {
    formKey: 'userFinanceForm',
    entityPathArray: ['user'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const formConfigFinance = {
    formKey: 'userFinanceForm2',
    entityPathArray: ['finance'],
    loadAction: loadUserFinanceAction,
    saveAction: saveUserFinanceAction
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sexe']),
    connectToForm(formConfigUser),
    connectToFieldHelpers()
)(SmartUser);

const ConnectedFinanceForm = compose(
    connectToMetadata(['financialMove', 'finance']),
    connectToForm(formConfigFinance),
    connectToFieldHelpers(),
    connectToState(selectData('customData'))
)(SmartFinance);

class SmartComponent extends Component {
    render() {
        return (
            <ScrollSpyContainer>
                <ConnectedUserForm {...this.props}/>
                <ConnectedFinanceForm {...this.props}/>
            </ScrollSpyContainer>
        );
    }
};

SmartComponent.displayName = 'SmartComponent';
export default SmartComponent;
```

 Il vous suffit alors de renseigner le nœud du state que vous voulez récupérer : `customData` via la fontion selectData (qui permet de récupérer la bonne partie du state) et de vous connecter via la fonction connect de Redux.
 Et voilà, je vous jure que c'est fini, votre information se trouve maintenant dans vos props !

```jsx
const User = ({fieldFor,listFor, victoire, echec, ...otherProps}) => (
  <Panel title={victoire ? "User " +victoire : "User " + echec} {...otherProps}>
      {fieldFor('name', {entityPath: 'finance'})}
      {fieldFor('amount', {entityPath: 'finance'})}
      {listFor('moves', { redirectEntityPath: ['financialMove'], LineComponent: FinancialMoveLine})}
  </Panel>
)
```

```jsx
// views/user/financialMoveLine.js
import React, {PropTypes} from 'react';

function FinancialMoveLine({fieldForLine, ...otherProps}) {
    return (
        <div>
            <div>{fieldForLine('transactionType', {entityPath: 'financialMove'})}</div>
            <div>{fieldForLine('amount', {entityPath: 'financialMove'})}</div>
        </div>
    );
}

FinancialMoveLine.displayName = 'financialMoveLine';
FinancialMoveLine.propTypes = {
    onClick: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
};
FinancialMoveLine.defaultProps = {
    options: []
}
export default FinancialMoveLine;
```

- Le service

```jsx
// service/index.js
import focusFetch from 'focus-application/fetch/fetch-proxy'

export const loadUserFinance = async ({id}) => {
    const response = await focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'})
    const data = await response;
    return {...data, __Focus__updateRequestStatus: data.__Focus__updateRequestStatus};
}

export const saveUserFinance = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 0);
    });
    return {...finance};
}
```

- La route

```jsx
// router/index.js
import React from 'react';
import {IndexRoute, Router, Route} from 'react-router';
import {hashHistory} from 'react-router';

/* Components */
import Layout from '../containers/layout';
import Home from '../views/home';
import CustomFinanceUserForm from '../views/user/custom-finance-user-form';

const RouterRoot = <Router history={hashHistory} key='router'>
    <Route path='/' component={Layout} key='mainRoute' >
        <IndexRoute component={Home}/>
        <Route path='user/list/:id' component={({params}) => <CustomFinanceUserForm id={params.id}/>} />
    </Route>
</Router>;

//{/* On injecte comme composant d'application un composant connecté au store redux */}
//{/* Le composant IndexRoute signifie qui sera appelée par défaut*/}
export default RouterRoot;
```

```jsx
// views/home.js
import React, {Component} from 'react';
import {compose} from 'redux';
import {Link} from 'react-router';
import Panel from 'focus-components/panel';
import Button from 'focus-components/button';

const routes = [
    {route: '/user/list/120', destination: 'Custom data', description: 'Exemple d\'utilisation d\'un custom midlleware', title: 'Custom data'}
];

const Home = props => {
    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {routes.map(route => <div key={route.route} style={{margin: '10px'}}>
                <Panel title={route.title} Buttons={null}>
                    <p>{route.description}</p>
                    <div className="mdl-card__actions mdl-card--border">
                        <Link to={route.route} className="mdl-button mdl-button--colored">
                            {route.destination}
                        </Link>
                    </div>
                </Panel>
            </div>)}
        </div>
    )
}
export default Home;
```

Voici ce qu'on obtient :

![image](https://cloud.githubusercontent.com/assets/8124804/22893718/dc3e54e0-f216-11e6-9724-7e7233f6d151.png)

> Pour rappel et pour conclure cette partie sur les middlewares, le principal c'est de comprendre qu'un middleware a accès au state dans sa globalité et qu'il fonctionnne dans un context donné, à l'inverse d'un reducer qui est pur et ne travaille que sur une partie de state pour en donner une autre. Les deux sont à utiliser pour des cas différents, et il n'est pas superflu de se poser les bonnes questions avant de choisir l'un ou l'autre.

---

[Prochaine partie : les autres composants](../../../../tutorial-step-5/src/views/05-Autres%20composants/)
