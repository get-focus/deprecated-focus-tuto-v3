# Votre premier formulaire

Commençons par quelque chose de simple, on va afficher simplement les informations d'un User, avec son prénom, son nom, son id, sa civilité via une liste de référence et son sexe.

Il y a alors quatre étapes pour réaliser cela :
- la vue,
- les actions,
- les services,
- les reducers

Il faut créer les domaines qui permettent de définir des règles que nous appliquerons sur les champs de notre formulaire.

```jsx
// domains.index.js
import React, {Component, PropTypes} from 'react';

import InputDate from 'focus-components/input-date';
import InputText from 'focus-components/input-text';

export const DO_ID = {
    type: 'text'
}

export const DO_TEXTE = {
    type: 'text'
}

export const DO_DATE = {
    type: 'text',
    InputComponent: InputDate
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
```

Nous allons appliquer ces domaines dans les entity-definitions.

```jsx
config/entity-definitions/index.js
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

## La vue

Nous allons créer un composant React appelé User.

```jsx
// views/user/user-form.js
import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';

// Les boutons de save et de load sont maintenant portés par le panel
import Panel from 'focus-components/panel';
import {compose} from 'redux';

class User extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        // Load de l'entité !
        load({id});
    }

    render() {
        // Via le connectToFieldHelpers nous pouvons récupérer les fieldFor des props
        const {fieldFor} = this.props;
        return (
            <Panel title='User' {...this.props}>
                {fieldFor('uuid', {entityPath: 'user'})}
                {fieldFor('firstName', {entityPath: 'user'})}
                {fieldFor('lastName', {entityPath: 'user'})}
            </Panel>
        );
    }
};

User.displayName = 'User';

// FormKey : Elle doit être unique pour chaque Form, elle nous permet d'avoir un discriminant !
// Définit les définitions relatives au form en question, vous pouvez en mettre autant que vous voulez !
// LoadAction, elle porte bien son nom ! Elle se trouve maintenant dans les props sous le nom de .... load
// SaveAction, elle porte également très bien son nom et se trouve également dans les props sont le nom de ... save !!
// nonValidatedFields : tableau qui permet de ne pas prendre en compte un champs required d'une définition
const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};

// Il faut connecter notre composant aux différents providers
// Les domaines + définitions
// Puis pour le form
// et enfin le FieldHelpers
// Attention l'ordre des connecteurs est important !
const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(User);

//Attention de toujours exporter le composant connecté
export default ConnectedUserForm;
```

Expliquons le code de cette vue pas à pas !

### Création d'un composant :
 Rien de bien nouveau sous le soleil, je vous invite à aller [sur le site de React en cas de doute subsistant](https://facebook.github.io/react/docs/react-component.html). Notre composant est un composant React des plus classiques.

> A noter, le composant Panel utilisé, est le panel disponible dans focus-component et ainsi c'est lui qui pose les boutons save et load du panel d'où l'intérêt de lui passer `{...otherProps}`

 > Dans l'immédiat, et pour une meilleure clarté de ce tutoriel, le composant User est une classe qui possède la logique (load ...) et l'affichage. En pratique, nous vous encourageons de séparer cette logique de l'affichage afin d'utiliser des composants purs, pour plus de performance, de beauté !

Voici ce que l'on obtient alors :

```jsx
// views/user/user-form.js
import React, {Component, PropTypes} from 'react';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
import {connect as connectToFieldHelpers} from 'focus-graph/behaviours/field';
import {loadUserAction, saveUserAction} from '../../actions/user-actions';

import Panel from 'focus-graph/components/panel';
import {compose} from 'redux';

const User = ({fieldFor, ...otherProps}) => (
  <Panel title='User' {...otherProps}>
      {fieldFor('uuid', {entityPath: 'user'})}
      {fieldFor('firstName', {entityPath: 'user'})}
      {fieldFor('lastName', {entityPath: 'user'})}
  </Panel>
)

class SmartUser extends Component {
    componentWillMount() {
        const {id, load} = this.props;
        // Et voilà un load !
        load({id});
    }

    render() {
        const {fieldFor} = this.props;
        return (
          <User fieldFor={fieldFor} {...this.props}/>
        );
    }
};

User.displayName = 'SmartUser';

const formConfig = {
    formKey: 'userForm',
    entityPathArray: ['user'],
    loadAction: loadUserAction,
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser );

export default ConnectedUserForm;
```

### Connexion au provider :
Avant toute chose, pour petit rappel, cette connexion est possible grâce aux provider qui ont été mis précédemment autour de vos composants, ainsi que la création du store (via le createStoreWithFocus). Dans notre cas nous allons connecter notre composant :
- aux métadonnées (les définitions et les domaines)
- aux fonctionnalités disponibles du Form via un objet de config
- aux fieldHelpers qui va exposer les fonctionnnalités de fieldFor

Le `connectToForm` est l'élément principal de cet écran, il attend un objet spécifique :

``` jsx
const formConfig = {
//FormKey : Elle doit être unique pour chaque Form, elle nous permet d'avoir un discriminant !
    formKey: 'userForm',
//Définit les définitions relatives au form en question, vous pouvez en mettre autant que vous voulez !
    entityPathArray: ['user'],
//Load Action, elle porte bien son nom ! Elle se trouve maintenant dans les props sous le nom de load
    loadAction: loadUserAction,
//Save Action, elle porte également très bien son nom et se trouve également dans les props sont le nom de save
    saveAction: saveUserAction,
    nonValidatedFields: ['user.firstName']
};
```
**Le tableau de nonValidatedFields :** ce tableau permet, dans le cas où l'entity definition de votre entity utilisée dans le formulaire a des champs que vous ne souhaitez pas valider.  Nous préconisons une utilisation occasionnelle de ce tableau. En effet si cela devient systématique, nous recommandons de faire des objets non-persistés en base spécifique pour le formulaire en question.  
Pour la forme, il suffit de lui passer le champ en question de l'entity via une notation simple : 'entity.nomDuChamps'. Pour les champs listes, même principe mais avec un tableau pour chaque champ de l'entité de la liste. Voici un exemple complet : `nonValidatedFields: ['user.uuid', {'user.childs': ['firstName']}]`

> Pour information ce connecteur utilise le `connect` au store de redux afin de récupérer le nœud form du store. Pour en savoir plus sur le shape du store, n'hésitez pas à aller voir la documentation liée.

> Votre composant est maintenant connecté aux différents provider dont vous avez besoin, n'oubliez pas que c'est le composant connecté qu'il faut exporter !

### Votre composant est prêt !

Et voilà rien de plus simple maintenant, tout est dans vos props ! Le fieldFor, selectFor et ListFor, le save, le load et compagnie !
Vous pouvez maintenant construire votre vue avec des fieldFor comme ça par exemple :
`{fieldFor('uuid', {entityPath: 'user'})}`

Comme il est possible d'associer plusieurs entityPath à un form, il devient nécessaire d'indiquer pour chaque fieldFor l'entityPath à laquelle il appartient ! Il est possible également de surcharger toutes les fonctions `onChange` ou `onBlur` :
`{fieldFor('uuid', {onChange: () => {console.log('onChange changé !')}, entityPath: 'user'})}`

Dans le cas ou votre formulaire n'est associé qu'à une seule entité, il n'est pas nécessaire d'indiquer l'entityPath à chaque fois.

> Pour mettre ce composant en musique, comme vous l'avez sans doute remarqué, nous avons dû importer des actions ! Pas de panique, c'est la prochaine partie !  
> Si vous souhaitez ne faire que de l'affichage, l'action save n'est pas obligatoire.

## Les actions

Nous avons deux actions à écrire le load et le save. Il est alors possible d'utiliser l'actionBuilder. Nous préconisons l'utilisation de ce dernier, mais ce n'est pas une obligation.

```jsx
// actions/user-actions.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUser, saveUser} from '../services/';

const _loadUserAction = actionBuilder({names: ['user'], type: 'load', service: loadUser});
export const loadUserTypes = _loadUserAction.types;
export const loadUserAction = _loadUserAction.action;

const _saveUserAction = actionBuilder({names: ['user'], type: 'save', service: saveUser});
export const saveUserTypes = _saveUserAction.types;
export const saveUserAction = _saveUserAction.action;
```

Et voilà de belles actions ! Plusieurs points à expliquer mais avant tout si vous n'êtes pas encore au point sur les actions, les reducers, le store redux, je vous invite grandement à retourner [voir la documentation de redux à ce sujet](http://redux.js.org/docs/basics/Reducers.html) !
Vous avez trois choses à renseigner ici :

- les `names `: c'est un tableau qui correspond aux nodes du store redux concernés par votre action (dans notre cas nous avons mis `user`), il est tout à fait possible d'en mettre plusieurs pour mettre à jour plusieurs nœuds ([voir l'exemple à ce sujet](../03-Deux noeuds/)))
- le type : toute action doit avoir un type, load ou save
- le service : fonction qui fait appel aux serveurs

> Vous avez ainsi en retour, une action que vous allez utiliser dans votre vue, ainsi que des types qui seront utilisés dans vos reducers (expliqué juste en dessous !)


## Les services

Les services fonctionnent exactement de la même façon qu'avant, ne perdons pas de temps inutilement.
On rappellera juste que les services renvoient des promesses, pour plus d'informations voici la documentation :
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise.

```jsx
// services/index.js
import focusFetch from 'focus-application/fetch/fetch-proxy'

export const loadUser = async ({id}) => {
    const response = await focusFetch({url: `http://localhost:9999/x/complex/${id}`, method: 'get'})
    const data = await response;
    return { ...data.user, __Focus__updateRequestStatus: data.__Focus__updateRequestStatus };
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

Et dans index.js, ajoutez :

```jsx
import {initFetch} from './services/fetch';
initFetch(store.dispatch);
```

## Les reducers

Pour rappel un reducer est une fonction pure (pas liée à un contexte, dans d'autres termes une fonction `static` !) avec une signature très simple :
		`(previousState, action) => newState`

```jsx
// reducer/index.js
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

Encore une fois quelques explications très simples. Souvenez-vous, dans Redux, les reducers permettent de mettre à jour une partie du state pour une action particulière, discriminée par son type.  Le `reducerBuilder` permet alors de réaliser cela facilement pour nos deux actions construites avec l'`actionBuilder`. Il prend en entrée un objet composé de :
- name : correspondant à votre entité définition.
- LoadTypes : l'`actionBuilder` permet de construire trois actions au sens Redux du terme : la request, la response, et l'error. Ces trois types sont renvoyés par l'actionBuilder dans l'objet loadUserTypes que nous avons importé.
- SaveTypes : même principe que le load.
- DefaultData : il est également possible de mettre un state par default dans les reducers Redux. Cette fonctionnalité est également disponible via le `reducerBuilder` en lui donnant l'objet souhaité.

Ce builder permet donc de construire des reducers Redux. Voilà ce qu'il créé :
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

Ajoutons le reducer dans notre store.

```jsx
// store/index.js
import createStoreWithFocus from 'focus-graph/store/create-store';

import headerReducer from 'focus-application/header/header-reducer';
import messageReducer from 'focus-application/messages/messages-reducer';
import confirmReducer from 'focus-application/confirm/confirm-reducer';
import fetchReducer from 'focus-application/fetch/fetch-reducer';

import DevTools from '../containers/dev-tools'
import rootReducer from '../reducer';

import i18n from 'i18next';

let lastCreatedStore;

console.log('rootReducer', rootReducer);

export default function configureStore(initialState){
    const store = createStoreWithFocus(
        {
            dataset: rootReducer,
            header: headerReducer,
            messages: messageReducer,
            confirm: confirmReducer,
            fetch:fetchReducer
        },
        [],
        [DevTools.instrument()],
        props => { return i18n.t(props)}
    );

    lastCreatedStore = store;
    return store;
};
```

Il faut maintenant connecter la vue créée au router en important celle-ci dans le fichier router et en précisant le chemin amenant à notre vue.

```jsx
// router/index.js
import React from 'react';
import {IndexRoute, Router, Route} from 'react-router';
import {hashHistory} from 'react-router';

/* Components */
import Layout from '../containers/layout';
import Home from '../views/home';
import User from '../views/user/user-form';

const RouterRoot = <Router history={hashHistory} key='router'>
    <Route path='/' component={Layout} key='mainRoute' >
        <IndexRoute component={Home}/>
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
    </Route>
</Router>;

//{/* On injecte comme composant d'application un composant connecté au store redux */}
//{/* Le composant IndexRoute signifie qui sera appelée par défaut*/}
export default RouterRoot;
```

Et enfin modifier le fichier home pour afficher notre carte menant vers la vue du formulaire.

```jsx
// home.js
import React, {Component} from 'react';
import {compose} from 'redux';
import {Link} from 'react-router';
import Panel from 'focus-components/panel';
import Button from 'focus-components/button';

const routes = [
    {route: '/user/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'}
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

> De la même façon que l'actionBuilder, le reducerBuilder permet de simplifier les développements. Cependant son utilisation n'est pas obligatoire.

Voici ce qu'on affiche :
![image](https://cloud.githubusercontent.com/assets/8124804/22825127/ad27b18e-ef8b-11e6-8a78-57b135d6320c.png)

## Ajout d'une liste de références

Pour une utilisation complète de Focus, il serait bien de ne pas oublier les listes de références.

On va faire cela en quelques étapes :

- le service de chargement des listes

Toujours la même chose, c'est un service. Il a été simulé chez nous mais cela correspond à un appel serveur :

```jsx
//services/load-civility.js
export const loadCivility = () => Promise.resolve([
    {code: 'M', label: 'M'},
    {code: 'Mme', label: 'Mme'},
    {code: 'Mlle', label: 'Mlle'},
    {code: 'Dr', label: 'Dr'},
    {code: 'Prof', label: 'Prof'},
]);
```

- le fichier de masterDataConfig

Dans le dossier `config` nous avons donc ajouté un fichier : `master-data.js`. Celui-ci construit l'objet `masterDataConfig` nécessaire au provider `MasterData` qui permet le chargement des domaines et définitions.

```jsx
//config/master-datas.js
import {loadCivility} from '../../services/load-civility';

export const masterDataConfig  = [
    {
        name: 'civility',
        service: loadCivility
    }
];
```

- la vue

Il faut ajouter le champs dans le composant mais aussi le connecteur des MasterData : `connectToMetadata(['user'])`, le load dans le `componentWillMount` : `loadMasterData();` et dans le selectFor : `{selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}` il faut préciser le propriété masterDatum et le tour est joué !

```jsx
//views/user/user-form.js
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';

//...Votre code...

const User = ({fieldFor, selectFor, ...otherProps}) => (
    <Panel title='User' {...otherProps}>
        {fieldFor('uuid', {entityPath: 'user'})}
        {fieldFor('lastName', {entityPath: 'user'})}
        {fieldFor('firstName', {entityPath: 'user'})}
        {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
    </Panel>
)

//...Votre code...

componentWillMount() {
    const {id, load, loadMasterData} = this.props;
    // Et voilà un load !
    load({id});
    loadMasterData();
}

//...Votre code...

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);
```

- domaines et définitions

Importez le composant de liste de sélection...

```jsx
//config/domains/index.js
import InputSelect from 'focus-components/select-mdl';

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
```

...et créez la nouvelle règle pour la civilité.

```jsx
//config/entity-definitions/index.js
civility: {
    domain: 'DO_CIVILITE',
    isRequired: true
}
```

Voici maintenant ce que vous devriez obtenir en mode édition :
![image](https://cloud.githubusercontent.com/assets/8124804/22824676/29b55db2-ef89-11e6-801d-b3ffef20ad73.png)

## Ajout d'un radio select

Nous allons maintenant rajouter une liste de boutons radio pour la sélection du sexe de la personne.

Nous allons simuler un appel serveur qui renvoie la liste des labels.

```jsx
//services/load-sex.js
export const loadSex = () => Promise.resolve([
    {code: 'male', label: 'homme'},
    {code: 'female', label: 'femme'},
    {code: 'unknown', label: 'inconnu'}
]);
```
Dans master-data.js,

```jsx
//config/master-datas.js
import {loadCivility} from '../../services/load-civility';
import {loadSex} from '../../services/load-sex';

export const masterDataConfig  = [
    {
        name: 'civility',
        service: loadCivility
    },
    {
        name: 'sex',
        service: loadSex
    }
];
```

Créer le domaine qui va utiliser le composant select-radio qu'il faudra importer.
```jsx
//config/domains.js
import RadioSelect from 'focus-components/select-radio';

//...Votre code...

export const DO_SEXE = {
    SelectComponent: RadioSelect
}
```

L'ajouter dans entity-definitions.
```jsx
//config/entity-definitions.js
sex: {
    domain: 'DO_SEXE',
    isRequired: true
}
```

Ajoutons maintenant le champs dans la vue.

Modifiez le composant User :
```jsx
views/user/user-form.js
<Panel title='User' {...otherProps}>
    {fieldFor('uuid', {entityPath: 'user'})}
    {fieldFor('lastName', {entityPath: 'user'})}
    {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
    {fieldFor('firstName', {entityPath: 'user'})}
    {selectFor('sex', {entityPath: 'user', masterDatum: 'sex'})}
</Panel>

//...Votre code...

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility', 'sex']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);
```

Voici maintenant à quoi ressemble votre formulaire en mode édition :
![image](https://cloud.githubusercontent.com/assets/8124804/22824652/0f6c5136-ef89-11e6-8e49-945b8ee79e8e.png)

## Bilan

Nous avons donc réalisé un exemple complet de formulaire. On va juste faire un petit récapitulatif :

### Lancement par le cycle de vie du composant ou via un bouton

`Vue (load) => dispatch une action (request) => middleware réalisant une action asynchrone (appel au serveur) (request) => reducer => nouveau state => vue(s) mise(s) à jour (état loading) ---(après un certain temps)----> Response du serveur => dispatch une action (response ) => middleware (construction ou maj du state du form) (response) => reducer => nouveau state => vue(s) mise(s) à jour avec les données`

> Ce qu'il se passe quand un input change ou blur

```
field:dispatch(INPUT_CHANGE) => application:middleware(INPUT_CHANGE):(dispatch(FORM_STATE)) => reducers => newState => field receive new value

field:dispatch(INPUT_BLUR) => application:middleware(INPUT_CHANGE):(dispatch(FORM_STATE)) => reducers => newState => field receive new value
```

Ce formulaire permet ainsi d'avoir facilement :
- les actions de load et de save avec gestion de l'asynchronie des requêtes à l'Api avec une gestion des erreurs et l'affichage de celle-ci
- les fieldHelpers (fieldFor, selectFor, displayFor et listFor)
- le formatage des données via la fonction écrite dans les domaines (voir le tutoriel sur domaines)
- Une validation au blur (désactivable facilement)
- Une fonctionnement par défaut sur le `onChange` avec une gestion des erreurs et l'affichage de celles-ci
- Une validation globale du formulaire avec une gestion des erreurs et l'affichage de celles-ci.

![capture](https://cloud.githubusercontent.com/assets/10349407/16381193/944d89fe-3c7b-11e6-9c05-d1b6c1d49a02.PNG)

---

[Prochaine partie : un formulaire avec un ListFor](../../../tutorial-step-2/src/views/02-Les%20listes/)
