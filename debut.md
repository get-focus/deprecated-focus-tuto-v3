# Tutorial de fonctionnement de la nouvelle API de gestion des entités et des pages

## De quoi part'on

Nous avons une API qui nous sert un objet JSON de la forme suivante

```json
{  
   "informations":{  
      "uuid":"58d94a87-b8e5-40af-b2d7-fb5ee8cb1270",
      "firstName":"Kian",
      "lastName":"Stroman"
   },
   "adress":[  
      {  
         "uuid":"1234",
         "city":"Cronafort"
      }
   ],
   "finance":{  
      "name":"Personal Loan Account",
      "amount":"157.00",
      "currency":"European Unit of Account 9(E.U.A.-9)",
      "moves":[  
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
L'utilisateur a donc :
- Des informations uuid, name, firstName
- Une adresse
- Des informations financières

L'objectif de ce tutorial est d'afficher chacune de ces données éventuellement un peu plus.

Nous voulons avoir les informations suivantes:
- Un bloc qui contient des données aggrégées sous la forme suivante: `Voici ${name} ${firstName} qui habite à ${ville} et disose de ${amount} sur son compte`
- Un bloc disponible en édition qui contient les infortmations de l'utilisateur
- Un bloc qui récapitule les informations financières et qui permet de les valider

Un peu comme ceci

![img_1618](https://cloud.githubusercontent.com/assets/286966/16341155/0e5c798c-3a2c-11e6-98e7-276130a236d6.JPG)


## Initialisation de l'application

- Premièrement nous allons partir du starter kit qui est vide et volontairement ne contient ici que les fichiers de configuration.
- Le fichier `package.json` dispose d'une commande `start` que l'on peut appeller avec `npm start`
- Cette commande fait appel au script suivant:

```js
{
    "dev-server": {
    "command": "node ./server.js", //script appellé au start
    "env": { // L'ensemble des variables d'environnements réglées
      "DEV": true, // Est ce qu'on est en dev ou en prod
      "SOURCE_MAPS": false, // Active t'on les source maps
      "ENTRY_FILE_PATH": "./src/index", // Quel est le point d'entrée
      "PAGE_TITLE": "Focus entity dev page", // Le titre de la page
      "MINIMIFY": false, // Doit'on minifier les sources
      "API_PORT": 9999, // Le port de l'api
      "PACKAGE_JSON_PATH": "../",// Le chemin du package.json
      "ANCHOR_CLASS": "focus-redux-demo-app" // Quelle est la classe du container
    }
  }
}
```

- Lancer la commande `npm start` et rendez vous à [http://localhost:3000](http://localhost:3000)
- Il ne se passe rien

Nous allons donce créer un dans le fichier index.js les élements suivants
Le but est juste d'afficher un composant React.

```jsx
// On récupère react
import React from 'react';
import ReactDOM from 'react-dom';

// On crée le composant Application
const App = props =>
<div>
    /*{On injecte la props name dans le titre}*/
    <h1>Bienvenue {props.name}</h1>
</div>;

// La fonction ReactDOM est utilisée afin de rendre un composant React dans le DOM du navigateur. On doit lui fournir un conteneur HTML en second argument.
ReactDOM.render(
  // On créé le composant App et on lui fournit une props name
  <App name='pierre' />,
  // Conteneur HTML <div class='focus-redux-demo-app'></div>
  // Présent en amont
  document.querySelector('.focus-redux-demo-app')
);
```

> Les fonctions pures ou stateless servent à créer des composants simplement, sans cycle de vie et sans state.
> Par défaut il est recommandé d'essayer d'écrire chaque composant sous forme de fonction pure.
> Voir la doc de [react](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)

## Brancher un routeur

L'objectif est maintenant de brancher un routeur dans notre application.

> Rappel: le routeur est ici afin de gérer le changement de page au sein de la spa.

![slack_for_ios_upload_720 3](https://cloud.githubusercontent.com/assets/286966/16158384/45c1671c-34bd-11e6-8cc8-7d34085ee7b0.jpg)



Nous allons créer deux pages.
Une page **Home** et qui est la page d'accueil de l'application et une page **User** qui sera la page de détail d'un utilisateur.
Afin de pouvoir avoir naviguer au sein de l'application, nous allons utiliser la librairie React routeur.

Tout d'abord il faut faire fonctionner notre app avec le routeur.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
// importation des éléments de react-router.
import {Router, Route, hashHistory } from 'react-router'

// On crée le composant Application
const App = props => <div><h1>Bienvenue {props.name}</h1>{props.children}</div>;

ReactDOM.render(
  <Router history={hashHistory}><Route path='/' component={App} /></Router>,
  document.querySelector('.focus-redux-demo-app')
);
```
- Ensuite nous allons créer deux composants simples

```jsx
// views/home.js
import React from 'react';
const Home = props => <div>Home Page: {props.date}</div>;
export default Home;

// views/user/index.js
import React from 'react';
const User = props => <div>User: {props.name}</div>;
export default User;
```

- Maintenant nous allons injecter ces composants dans le routeur.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route, hashHistory } from 'react-router'

/* Components */
import Home from './views/home';
import User from './views/user';

// On crée le composant Application
const App = props => <div style={{color: 'red'}}><h1>Bienvenue {props.name}</h1>{props.children}</div>;

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App} >
      {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
      <IndexRoute component={Home} />
      {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
      <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
    </Route>
  </Router>,
  document.querySelector('.focus-redux-demo-app')
);
```
> Maintenant on a un routeur et une application qui fonctionne pas trop mal
> Mais bon l'usage reste super basique

## Provider et connector

 Maintenant nous allons nous occuper d'initialiser l'application avec l'ensemble des `Providers`. Le concept de Provider utilise des fonctionnalités avancées de `React`. React dispose d'un mécanisme appellé le `context` qui permet de passer des informations de manière implicites à un arbre de composant. Si un parent décide de fournir des informations dans son contexte, tous les enfants peuvent les lire. **Attention l'usage du contexte n'est pas recommandé pour autre chose que pour des librairies qui cherchent à abstraire un concept**. Un provider sert donc à inserer des informations dans le contexte. Il va souvent de paire avec un `connecteur` qui lui sert à extraire des informations du contexte pour les fournir en `props` au composant fils. Le concept de connecteur repose sur le pattern de `High Order Component`.

- Nous allons ajouter en premier le Provider de `redux`, il sert à insérer dans le contexte le store applicatif. (On pourrait le mettre plus bas dans l'application) mais nous allons le mettre à la racine.

Le Provider de redux a donc besoin d'un store, qui est construit à partir des reducers. Un reducer étant une fonction, nous allons en créer un facilement.

- Première étape créer un store
```js
import {createStore} from 'redux';
const DEFAULT_STATE = {user: {name: 'pas de nom'}};
// On créé un store bidon qui a un state par défaut et le retourne.
// Un reducer est une fonction qui prend le state et le modifie
// Ici notre reducer est une fonction identité
const store = createStore((state = DEFAULT_STATE) => state);
```
- Deuxième étape, on fournit ce store au Provider qui entoure le reste de l'application.

```jsx
import {Provider as StoreProvider} from 'react-redux';
// on créé un composant root pour y voir plus clair
const Root = ({store}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'applciation.*/
<StoreProvider store={store}>
    <Router history={hashHistory}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={App} >
        {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
        <IndexRoute component={Home} />
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
</StoreProvider>;

Root.propTypes = {store: PropTypes.object.isRequired};
// On passe le store en props à root
ReactDOM.render(
  <Root store={store} />,
  document.querySelector('.focus-redux-demo-app')
);
```

- Jusque ici rien de très compliqué, maintenant, nous allons connecter l'application (pour tester) au store redux via le connecteur.

```jsx
import {connect as connectToStore} from 'react-redux';
// On crée le composant Application
const App = props => <div style={{color: 'red'}}><h1>Bienvenue {props.name}</h1>{props.children}</div>;
// On le connect au store redux et on remplace `App` par `AppConnectToStore`
const AppConnectToStore = connectToStore(s => ({name: s.user.name}))(App);
```

- Ce qui nous donne finalement en code complet que l'on risque d'éclater en plusieurs fichiers


```jsx
import React , {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route, hashHistory } from 'react-router'

import {createStore} from 'redux';
import {Provider as StoreProvider, connect as connectToStore} from 'react-redux';

/* Components */
import Home from './views/home';
import User from './views/user';

// On crée le composant Application
const App = props => <div style={{color: 'red'}}><h1>Bienvenue {props.name}</h1>{props.children}</div>;

const DEFAULT_STATE = {user: {name: 'Pierre Besson'}};
// On créé un store bidon qui a un state par défaut et le retourne.
const store = createStore((state = DEFAULT_STATE) => state);
const AppConnectToStore = connectToStore(s => ({name: s.user.name}))(App);

const Root = ({store}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'applciation.*/
<StoreProvider store={store}>
    <Router history={hashHistory}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={AppConnectToStore} >
        {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
        <IndexRoute component={Home} />
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
</StoreProvider>;

Root.propTypes = {store: PropTypes.object.isRequired};

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('.focus-redux-demo-app')
);
```

> C'est bon maintenant nous avons un store, une application connectée à ce store
> Rappel, pour le moment nous n'avons fait que du React, redux, et react routeur.

- Nous allons maintenant sortir la partie application du composant root dans un fichier `src/app.js`.


```jsx
import React, {PropTypes} from 'react';
import {connect as connectToStore} from 'react-redux';

// Ceci est un sélecteur de state, il sera localisé près de son reducer plus tard.
const userSelector = state => ({...state.user});

// On crée le composant Application
const App = props =>
  <div style={{color: 'blue'}}>
    <h1>Bienvenue {props.name} </h1>
    {props.children}
  </div>;

App.defaultProps = {
  name: 'Without name maybe not...'
}

App.propTypes = {
  name: PropTypes.string.isRequired
}
// On exporte le composant Application connecté au store redux.
export default connectToStore(userSelector)(App);

```

nous avons donc un composant `Root` qui va ressembler à ceci:

```jsx
import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route} from 'react-router'
import {Provider as StoreProvider} from 'react-redux';
/* Components */
import App from './app';
import Home from './views/home';
import User from './views/user';

const Root = ({store, history}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'applciation.*/
<StoreProvider store={store}>
    <Router history={history}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={App} >
        {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
        <IndexRoute component={Home} />
        {/* Les :id sert à fournir un para  sssssssmètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
</StoreProvider>;

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default Root;
```

- Dernier point, nous allons également passer la partie reducer qui sert à construire le store dans un autre fichier `src/reducer/index.js`.

```js
const DEFAULT_STATE = {user: {name: 'pas de nom', date: new Date().getTime(), bababa: 'dddididid'}};
const rootReducer = (state = DEFAULT_STATE) => state

export default rootReducer;
```

On a donc dans le composant `root` pour le store:
```js
import reducer from './reducer';
//...
// On créé un store bidon qui a un state par défaut et le retourne.
const store = createStore(reducer);
```

## Maintenant que la structure initiale est terminée, on va initialiser la partie focus

> Note que cette partie n'est certainement pas présente dans le starter kit dans la mesure où tout est prêt pour un démarrage rapide.

- Afin d'initialiser l'application , nous avons besoin de définir les domaines et les définitions des entités.
- Pour cela nous mettons à disposition plusieurs `Providers`, par exemple pour les métadonnées, nous utilisons le `MetadataProvider`, à qui on doit fournir les domaines et les définitions des entitées de l'appication.

### Rappel les domaines

Les domaines servent à définir les domaines de valeurs des champs, ils portent une configuration ainsi qu'un ensemble de métadonnées.

On peut donc créer un fichier de config qui contiendra: les domaines.
Les domaines sont définis plus particulièrement [ici](http://kleegroup.github.io/focus-docs/tutorial/surcharger-form-input.html).

> Pour information, vous pouvez insérer ce que vous souhaitez dans les domaines afin de le récupérer dans le composant cible.
> Je vous invite à lire la superbe documentation dans le connecteur de metadata [ici](https://github.com/get-focus/focus-redux/blob/master/src/behaviours/metadata.js#L71) :+1
> L'objectif de ces metadonnées et d'être fournies au composant générique `Field`

![slack for ios upload](https://cloud.githubusercontent.com/assets/286966/16376434/7e7d06c4-3c60-11e6-9f4e-5b263df071b2.jpg)


```js
export const domains = {
    DO_TEXT_MOYEN: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 50
            }
        }]
    },
    DO_TEXTE_LONG: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }],
        formatter: value => value + ' - formaté',
        validationOnBlur: false

    },
    DO_DATE : {
        formatter: date => date ? moment(date, format).format('DD/MM/YYYY') : '',
        InputComponent: DateComponent
    },
    DO_CHECKBOX = {
      type: 'boolean',
      InputComponent: Checkbox,
      DisplayComponent: DisplayCheckbox
    },
    DO_CIVILITE: {
        type: 'text',
        validator: [{
            type: 'string',
            options: {
                maxLength: 200
            }
        }]
    }
};
```
Nous devons également définir les entités de l'application.
Nous allons créer un fichier `config/entity-definitions` qui va nous permettre de définir l'ensemble des domaines des champs de l'application. Cette partie est normalement générée depuis le modèle de données ou depuis l'API (c'est certainement la dernière option qui est préférable afin de coller au contrat d'échange entre l'application et le serveur).

```js
export const user = {
  uuid: {
    domain: 'DO_ID',
    required: true
  },
  firstName: {
    domain: 'DO_TEXTE',
    required: true
  },
  lastName: {
    domain: 'DO_TEXTE',
    required: true
  }
}

export const address = {
  uuid: {
    domain: 'DO_ID',
    required: true
  },
  city: {
    domain: 'DO_TEXTE',
    required: true
  }
}

export const finance = {
  name:  {
    domain: 'DO_TEXTE',
    required: true
  }
  amount:  {
    domain: 'DO_AMOUNT',
    required: true
  }
  currency:  {
    domain: 'DO_SYMBOL',
    required: true
  }
  moves:{
    child: 'financialMove'
  }
}

export const financialMove = {
  transactionType: {
    domain: 'DO_CODE',
    required: true
  },
  amount: {
    domain: 'DO_MONTANT',
    required: true
  }
}
```

- Maintenant que nous avons accès à ces définitions, nous allons les initialiser dans l'application.
- De la même manière que nous avons enrobbé le routeur d'un provider de store, nous allons ajouter le provider de métadonnées.

- Nous allons ajouter les lignes suivantes afin de fournir à l'ensemble des composants fils le contenu des domaines et des définitions.

```jsx
import {Provider as MetadataProvider} from 'focus-redux/behaviours/metadata';
import * as definitions from './config/entity-definitions';
import * as domains from './config/domains';

// ...
<StoreProvider store={store}>
  <MetadataProvider definitions={definitions} domains={domains}>
    <Router history={history}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
        {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
        <Route path='/' component={App} >
        <IndexRoute component={Home}/>
        {/* Les :id sert à fournir un para  sssssssmètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
  </MetadataProvider>
</StoreProvider>;
```

- Nous allons maintenant nous connecter au provider de metadonnées.
- Par exemple si nos nous plaçons dans le composant application qui ets déjà connecté au store.

```jsx
import {compose} from 'redux'; // Pour composer les connecteurs
import {connect as connectToMetadata} from 'focus-redux/behaviours/metadata';
// ...
// On crée le composant Application
const App = props =>
  <div style={{color: 'blue'}}>
    <h1>Bienvenue dans ce superbe tutoriel {props.name} </h1>
    {/* On récupère les définitions dans les props*/}
    {JSON.stringify(props.definitions)}
    {props.children}
  </div>;
// ...
// On exporte le composant Application connecté au store redux.
export default compose(
  connectToStore(userSelector),
  connectToMetadata(['user','address','financialMove'])
)(App);
```
> En pratique nous n'allons pas connecter le composant d'application au store. Nous allons plutôt travailler sur une page qui va afficher les éléments prévus.

## Faire une page avec la nouvelle ma manière de gérer le form.

- Avant de commencer, pour pouvoir utiliser le form il faut placer d'autres provider
- FieldHelpersProvider => Qui va nous servir à pouvoir récupérer les helper de form dans chacun des composantrs
- MasterDataProvider => Qui va nous servir à injecter des listes de références dans certaines parties de l'application.

Dans le composant root.

```jsx
import {Provider as MetadataProvider} from 'focus-redux/behaviours/metadata';
import {Provider as FieldHelpersProvider} from 'focus-redux/behaviours/field';
import {Provider as MasterDataProvider} from 'focus-redux/behaviours/master-data';
//...
const Root = ({store, history}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'applciation.*/
<StoreProvider store={store}>
  <MetadataProvider definitions={definitions} domains={domains}>
    <FieldHelpersProvider >
      <MasterDataProvider>
        <Router history={history}>
          {/* On injecte comme composant d'application un composant connecté au store redux */}
            {/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
            <Route path='/' component={App} >
            <IndexRoute component={Home}/>
            {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
            <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
          </Route>
        </Router>
      </MasterDataProvider>
      </FieldHelpersProvider>
  </MetadataProvider>
</StoreProvider>;
```

# Dernier point avant de se lancer on va créer un store un peu plus avancé

## Créer un store redux avec Focus

### Le concept de store dans redux

Afin d'utiliser les reducers que vous avez pu écrire, il est nécessaire d'utiliser la méthode `createStore` de redux qui est documenté [ici](http://redux.js.org/docs/api/createStore.html).


La création d'un store sert à :
- fournir une méthode pour dispatcher une action `dispatch`
- fournir une méthode pour s'abonner à des changements sur un store.
- Enregistrer l'arbre de reducer que vous avez produit afin que lorsqu'une action soit dispatchée, le nouveau state soit calculable via les reducers.
- Fournir les **enhancers** de store qui sont surtout les middlewares qui on des buts variés et qu'il faut utiliser avec parcimonie.


```
dispatch(action) => middleware(action) => state = reducers(previousState, action)
```

> Petit apparté sur les middleware on a des middleware dit
> - **third-party** qui vont ammener à redux des fonctionnalités comme le log des actions, les devtools.
> - **custom** dont le rôle est de réagir à certaines actions et d'en dispatcher de nouvelles lors de.

### Créer un store avec les comportements focus

Afin de vous aider au mieux au sein des projets nous avons préparé un certain nombre de chose déjà prévue dans le store. Nous avons donc crée une méthode `createStoreWithFocus` qui ajoute les éléments suivants. `createStoreWithFocus(reducers, customMiddlewares, otherEnHancers) => createStore(reducers + focusReducers,customMiddlewares + focusmiddleWare + otherEnHancers + enhancersFocus)`

Voici ce que le `createStoreWithFocus` manipule.

- `reducers: {dataSet, customData}`
  - `dataSet` qui va contenir les reducers de données, qui seront populés lors des chargement de données
  - `customData` qui contiendra un morceau de state propre au projet qui sera libre en terme de contenu
  -  `...focusReducers` qui sont l'ensemble des reducers prévus par focus et prévus pour réagir aux différents connecteurs / providers / middleware que nous proposons.
    - `master-data`: les reducers responsables de stocker les listes de références
    - `metadata`: les reducers responsables de stocker les domaines et les définitions
    - `form` qui contiendra la partie du state propre à chaque formulaire ou bloc de données indépendants. Ce morceau de state sera populé par les middlewares à chaque action comme chargement des données, sauvegarde des données, validation, saisie dans le champ, sortie de champ. Cette partie de state contient également l'ensemble des information de chaque field de l'application comme: est ce que le champ a changé, quel est sa valeur formattée, est ce qu'il est en édition, est ce qu'il a une erreur.
    > Pour plus d'informations, n'hésithez pas à aller voir la forme du state de chaque [form](https://github.com/get-focus/focus-redux/blob/6cb7b32f50caaa8ebbd093b1e24459a1b9e2f3b5/src/reducers/form.js#L22) et de chaque [field](https://github.com/get-focus/focus-redux/blob/6cb7b32f50caaa8ebbd093b1e24459a1b9e2f3b5/src/reducers/form.js#L31)

  - `...otherReducers` qui contiendra d'autres reducers que vous pouvez fournir pour les extensions par exemple.
- `middleware {customMiddlewares, formMiddleware, fieldMiddleware, thunkMiddleware}`
  - `customMiddlewares` l'ensemble des middleware servant à faire un comportement métier _custom_ au projet. (Mettre à jour un champ en fonction d'un autre par exemple, un exemple détaillé est dans ce tutoriel)
  - `formMiddleware` le middleware responsable de la population du state propre au formulaire
  - `fieldMiddleware` le middleware responsable de la population de chaque field et de la réaction à chaque frappe, chaque changement de focud...
  - `thunkMiddleware` sert à pouvoir appeller des actions asynchrones. Voir [ici](https://github.com/gaearon/redux-thunk) pour de plus amples informations.
- `otherEnHancers` qui sert à fournir des enhancers à redux, typiquement le fait d'avoir des devtools redux.

### Exemple

Dans votre projet, vous allez créer un fichier `store.js` qui contiendra les éléments suivants:

```
import createStoreWithFocus from 'focus-redux/store/create-store';
import dataSetReducer from '../../src/reducer';
import {amoutToUpperCaseMiddleware, errorFieldMiddleware, ownActiondMiddleware} from '../../src/middleware/user-middleware';
import DevTools from '../containers/dev-tools'

const store = createStoreWithFocus(
  // Le reducer de données
  {dataSet: dataSetReducer},
  // Le tableau de middleware custom
  [errorFieldMiddleware, amoutToUpperCaseMiddleware,ownActiondMiddleware], [DevTools.instrument()] // on ajoute les devtools focus
);

export default store;
```

Ensuite ce store sera fournie au `Provider` de store exposé par [react-redux](https://github.com/reactjs/react-redux).


> Le socle applicatif est maintenant prêt.
> On y va, on peut passer aux exemples !


```
field:dispatch(INPUT_CHANGE) => application:middleware(INPUT_CHANGE):(diapatch(FORM_STATE)) => reducers => newState => field receive new value 
```
