# Votre premier formulaire

Commençons par quelque chose de simple, on va afficher simplement les informations d'un User, avec son prénom, son nom, son id, sa civilité via une liste de référence et son sexe.

Il y a alors quatre étapes pour réaliser cela :
- la vue,
- les actions,
- les services,
- les reducers

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
          <User fieldFor={fieldFor} { ...this.props}/>
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
actions/user-actions.js
import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';
import {loadUser, saveUser} from '../services/user-service';

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
// services/user-service.js
import fetch from './fetch';

export const loadUser = async ({id}) => {
  const response = await fetch(`http://localhost:9999/x/complex/${id}`)
  const data = await response.response.json();
  return data.user;
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

## Les reducers

Pour rappel un reducer est une fonction pure (pas liée à un contexte, dans d'autres termes une fonction `static` !) avec une signature très simple :
		`(previousState, action) => newState`

```jsx
// reducer/user-reducer.js
import {reducerBuilder} from 'focus-graph/reducers/reducer-builder';
import {loadUserTypes} from '../actions/user-actions';
import {saveUserTypes} from '../actions/user-actions';

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

> De la même façon que l'actionBuilder, le reducerBuilder permet de simplifier les développements. Cependant son utilisation n'est pas obligatoire.

Voici ce qu'on affiche :
![image](https://cloud.githubusercontent.com/assets/8124804/22733033/ab206508-edf0-11e6-85f1-4e7ca8175497.png)

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
//config/master-data.js
import {loadCivility} from '../services/load-civility';
import {loadAccountsNames} from '../services/load-accounts-names';

export const masterDataConfig  = [
  {
    name: 'civility',
    service: loadCivility
  },
  {
    name: 'accountsNames',
    service: loadAccountsNames
  }
];
```

- le provider masterData

Dans le fichier `root`
```jsx
import masterdatas from './config/master-datas';

//...Votre code...

<MasterdataProvider configuration={masterdatas}>
    <Router history={browserHistory} routes={routes} />
</MasterdataProvider>
```

- la vue

Il faut ajouter le champs dans le composant mais aussi le connecteur des MasterData : `connectToMetadata(['user'])`, le load dans le `componentWillMount` : `loadMasterData();` et dans le selectFor : `{selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}` il faut préciser le propriété masterDatum et le tour est joué !

```jsx
//views/user/user-form.js
import {connect as connectToMasterData} from 'focus-graph/behaviours/master-data';

//...Votre code...

componentWillMount() {
    const {id, load, loadMasterData} = this.props;
    // Et voilà un load !
    load({id});
    loadMasterData();
}

//...Votre code...

<Panel title='User' {...otherProps}>
    {fieldFor('uuid', {entityPath: 'user'})}
    {fieldFor('lastName', {entityPath: 'user'})}
    {selectFor('civility', {entityPath: 'user', masterDatum: 'civility'})}
    {fieldFor('firstName', {entityPath: 'user'})}
</Panel>

//...Votre code...

const ConnectedUserForm = compose(
    connectToMetadata(['user']),
    connectToMasterData(['civility']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUser);
```

Voici maintenant ce que vous devriez obtenir en mode édition :
![image](https://cloud.githubusercontent.com/assets/8124804/22733081/caa9225c-edf0-11e6-9e20-cf242e6ef3e0.png)

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

```jsx
//config/master-datas.js
 import {loadCivility} from '../services/load-civility';
 import {loadSex} from '../services/load-sex';
 import {loadAccountsNames} from '../services/load-accounts-names';

 export const masterDataConfig  = [
   {
     name: 'civility',
     service: loadCivility
   },
   {
     name: 'accountsNames',
     service: loadAccountsNames
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
},
```

Ajoutons maintenant le champs dans la vue.

Modifiez le composant User
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
![image](https://cloud.githubusercontent.com/assets/8124804/22733134/f8d1a1e0-edf0-11e6-97f9-a418b3bbfabf.png)

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

[Prochaine partie : un formulaire avec un ListFor](../02-Les%20listes/)
