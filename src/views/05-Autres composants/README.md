# Utilisation d'autres composants

Cette partie s'intéresse à mettre en musique d'autres composants de formulaires.

Le formulaire créé affichera comme nouveaux composants :
- un champs [date](https://github.com/get-focus/focus-components/tree/develop/src/input-date),
- un champs [select checkbox](https://github.com/get-focus/focus-components/tree/develop/src/select-checkbox),
- un champ [autocomplete](https://github.com/get-focus/focus-components/blob/develop/src/autocomplete-text/field.js)

Si vous avez fait les parties précédentes, vous devriez avoir déjà une bonne partie du code de prêt.

## Domains, entity-definitions et master-datas

```jsx
// domains/index.js
import React, {Component, PropTypes} from 'react';

import Checkbox from 'focus-components/input-checkbox';
import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';
import InputSelect from 'focus-components/select-mdl';
import RadioSelect from 'focus-components/select-radio';
import Autocomplete from 'focus-components/autocomplete-text/field';
import SelectCheckbox from 'focus-components/select-checkbox';

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

export const DO_ACCOUNTS_NAMES = {
    type: 'text',
    InputComponent: props => <div><Autocomplete/></div>
}

export const DO_CHECKBOX = {
    type: 'boolean',
    InputComponent: Checkbox
}

export const DO_SELECT_CHECKBOX = {
    type: 'boolean',
    InputComponent: SelectCheckbox
}
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
        isRequired: false
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
```



```jsx
import React from 'react';
import {Link} from 'react-router';
const cardStyle= {
  flex: 1,
  minWidth: '300px',
  maxWidth: '300px',
  marginTop: '7px',
  marginRight: '20px',
  marginBottom: '20px'
};
const Card = ({title,description, route, destination }) => {
  return (
      <div style={cardStyle} className="demo-card-wide mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {description}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Link to={route} className="mdl-button mdl-button--colored">
            {destination}
          </Link>
        </div>
    </div>
  );
}
export default Card;
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

Pour rappel un reducer est une fonction pure (pas liée à un contexte, dans d'autres termes une fonction `static` !) avec une signature très simple :
		`(previousState, action) => newState`

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

<Route path='user/component/:id' component={({params}) => <UserComponent id={params.id}/>} />
```

```jsx
// views/home.js
import React, {Component} from 'react';
import Card from './user/card';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
    {route: '/user/component/120', destination: 'user refs', description: 'Formulaire avec différents composants', title: 'User Components'}
];

const Home = props =>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
    </div>;
export default Home;
```


Encore une fois quelques explications très simples. Souvenez-vous, dans Redux, les reducers permettent de mettre à jour une partie du state pour une action particulière, discriminée par son type.  Le `reducerBuilder` permet alors de réaliser cela facilement pour nos deux actions construites avec l'`actionBuilder`. Il prend en entrée un objet composé de :

- name : correspondant à votre entité définition.

- LoadTypes : l'`actionBuilder` permet de construire trois actions au sens Redux du terme : la request, la response, et l'error. Ces trois types sont renvoyés par l'actionBuilder dans l'objet loadUserTypes que nous avons importé.

- SaveTypes : même principe que le load.

- DefaultData : il est également possible de mettre un state par default dans les reducers Redux. Cette fonctionnalité est également disponible via le `reducerBuilder` en lui donnant l'objet souhaité.

Ce builder permet donc de construire des reducers Redux, voilà ce qu'il créé :
```jsx
 function userReducer(state = DEFAULT_STATE, {type, payload}){
 const {data} = state;
  switch (type) {
   case REQUEST_LOAD_USER:
       return {data, loading: true, saving: false};
   case RESPONSE_LOAD_USER:
       return {data: payload, loading: false, saving: false};
   case ERROR_LOAD_USER:
	   return {data: payload, loading: false, saving: false};    
   default:
       return state
  }
 }
```

```jsx
// views/home.js
import React, {Component} from 'react';
import Card from './user/card';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
    {route: '/finance/120', destination: 'Finance List', description: 'Exemple d\'un formulaire avec un ListFor', title: 'Finance List'}
];

const Home = props =>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
    </div>;
export default Home;
```

```jsx
// views/user/card.js
import React from 'react';
import {Link} from 'react-router';
const cardStyle= {
  flex: 1,
  minWidth: '300px',
  maxWidth: '300px',
  marginTop: '7px',
  marginRight: '20px',
  marginBottom: '20px'
};

const Card = ({title,description, route, destination }) => {
  return (
      <div style={cardStyle} className="demo-card-wide mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {description}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Link to={route} className="mdl-button mdl-button--colored">
            {destination}
          </Link>
        </div>
    </div>
  );
}
export default Card;
```

![capture](https://cloud.githubusercontent.com/assets/10349407/16381193/944d89fe-3c7b-11e6-9c05-d1b6c1d49a02.PNG)

---

[Prochaine partie : les erreus globales](../06-Erreurs globales/)
