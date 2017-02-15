# Tutorial de fonctionnement de la nouvelle API de gestion des entités et des pages

Après avoir [récupéré le code source du tutoriel](#initialisation),
[pour commencer à créer votre premier formulaire, c'est par ici](../tutorial-step-1/src/views/01-Formulaire simple/).

Nous avons conscience qu'il reste quelques petites erreurs, nous avons fait ce tutoriel avec plein d'amour, n'hésitez pas à contribuer pour nous aider =) !

Afin d'aborder au mieux ce tutoriel, vous avez idéalement des connaissance en JavaScript. [Notre tutoriel est disponible ici](http://getfocus.io/formation-js/#/).
Vous pouvez approndir celles-ci ainsi que le stanfard JavaScript ECMAScript 6 [sur le site Mozilla Developer Network](https://developer.mozilla.org/fr/docs/Web/JavaScript).

# Prérequis

Avoir [git](https://git-scm.com/) et [node](https://www.npmjs.com/) d'installés.
Avoir dans C:\Users\«MON USER» :
un fichier.npmrc contenant
```sh
 //registry.npmjs.org/:_authToken=36b5317e-e385-4f97-841d-252a3036a490
proxy=http://172.20.0.9:3128/
```

et un fichier .bashrc contenant
```sh
export PYTHONPATH=/c/Python27/
export GYP_MSVS_VERSION=2013
export HTTPS_PROXY=http://172.20.0.9:3128
export HTTP_PROXY=http://172.20.0.9:3128
#Define the proxy variables.
export no_proxy=localhost,otherdomain.lan.net
```

## Initialisation

### Récupérer le tutoriel

Dans le dossier souhaité, récupérez le projet depuis la console Git.
Naviguez dans le dossier créé via le terminal. Nous avons déjà mis les dépendances qu'il faut dans le package.json.
Il reste à exécuter la commande `npm install`. Cela installera tous les modules nécessaires au fonctionnement de l'application dans un dossier node_modules.

```
git clone https://github.com/get-focus/focus-tuto-v3.git
cd focus-tuto-v3
npm install
npm start
```

## De quoi part-on

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
- des informations uuid, name, firstName
- une adresse
- des informations financières

L'objectif de ce tutoriel est d'afficher chacune de ces données, éventuellement un peu plus.

Nous voulons avoir les informations suivantes :
- Un bloc qui contient des données agrégées sous la forme suivante : `Voici ${name} ${firstName} qui habite à ${ville} et disose de ${amount} sur son compte`
- Un bloc disponible en édition qui contient les informations de l'utilisateur
- Un bloc qui récapitule les informations financières et qui permet de les valider

Un peu comme ceci

![image](https://cloud.githubusercontent.com/assets/8124804/22733365/c0af1e7c-edf1-11e6-9ac8-f2969759577b.png)

## Première exécution de l'application

- Lancez la commande `npm start` et rendez vous à [http://localhost:3000](http://localhost:3000)

Voici ce qui est affiché :
![image](https://cloud.githubusercontent.com/assets/8124804/22976522/719fe4a2-f38b-11e6-8101-d7b420e289ca.png)

Nous avons dans le fichier home.js les éléments suivants :

```jsx
// views/home.js
import React, {PureComponent} from 'react';

// un composant react
class Home extends PureComponent {
    render() {
        return <h1>Bienvenue sur le tutoriel de Focus v3</h1>
    }
}
Home.displayName = 'Home';
export default Home;
```

> Les fonctions pures ou stateless servent à créer des composants simplement, sans cycle de vie et sans state.
> Par défaut il est recommandé d'essayer d'écrire chaque composant sous forme de fonction pure.
> Voir la doc de [react](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)

## Brancher un routeur

> !!! Jusqu'à la fin de cette page, le code est purement explicatif et ne doit pas être utilisé pour réaliser les tutos

L'objectif est maintenant de brancher un routeur dans notre application.

> Rappel : le routeur est ici afin de gérer le changement de page au sein de la SPA.

![slack_for_ios_upload_720 3](https://cloud.githubusercontent.com/assets/286966/16158384/45c1671c-34bd-11e6-8cc8-7d34085ee7b0.jpg)

Nous allons créer deux pages.
Une page **Home** qui est la page d'accueil de l'application et une page **User** qui sera la page de détail d'un utilisateur.
Afin de pouvoir naviguer au sein de l'application, nous allons utiliser la librairie React Routeur.

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
  document.querySelector('.focus-graph-demo-app')
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
      {/* Le composant IndexRoute signifie qui sera appelée par défaut*/}
      <IndexRoute component={Home} />
      {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
      <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
    </Route>
  </Router>,
  document.querySelector('.focus-graph-demo-app')
);
```
> Maintenant on a un routeur et une application qui fonctionnent pas trop mal
> Mais bon l'usage reste super basique

Pour aller plus loin dans l'apprentissage de React Route, voici un tutoriel [sur le GitHub de ReactJS](https://github.com/reactjs/react-router-tutorial) et [un autre de CSS-Tricks](https://css-tricks.com/learning-react-router/).

## Provider et connector

 Maintenant nous allons nous occuper d'initialiser l'application avec l'ensemble des `Providers`. Le concept de Provider utilise des fonctionnalités avancées de `React`. React dispose d'un mécanisme appelé le `context` qui permet de passer des informations de manière implicite à un arbre de composant. Si un parent décide de fournir des informations dans son contexte, tous les enfants peuvent les lire. **Attention l'usage du contexte n'est pas recommandé pour autre chose que pour des librairies qui cherchent à abstraire un concept**. Un provider sert donc à insérer des informations dans le contexte. Il va souvent de pair avec un `connecteur` qui lui sert à extraire des informations du contexte pour les fournir en `props` au composant fils. Le concept de connecteur repose sur le pattern de [High Order Component](https://facebook.github.io/react/docs/higher-order-components.html).

- Nous allons ajouter en premier le Provider de `redux`, il sert à insérer le store applicatif dans le contexte. (On pourrait le mettre plus bas dans l'application) mais nous allons le mettre à la racine.

Le Provider de Redux a donc besoin d'un store, qui est construit à partir des reducers. Un reducer étant une fonction, nous allons en créer un facilement.

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
// On créé un composant root pour y voir plus clair
const Root = ({store}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'application.*/
<StoreProvider store={store}>
    <Router history={hashHistory}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={App} >
        {/* Le composant IndexRoute signifie qui sera appelé par défaut*/}
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
  document.querySelector('.focus-graph-demo-app')
);
```

- Jusqu'ici rien de très compliqué. Maintenant, nous allons connecter l'application (pour tester) au store redux via le connecteur.

```jsx
import {connect as connectToStore} from 'react-redux';
// On crée le composant Application
const App = props => <div style={{color: 'red'}}><h1>Bienvenue {props.name}</h1>{props.children}</div>;
// On le connect au store redux et on remplace `App` par `AppConnectToStore`
const AppConnectToStore = connectToStore(s => ({name: s.user.name}))(App);
```

- Ce qui nous donne finalement en code complet que l'on risque d'éclater en plusieurs fichiers


```jsx
import React, {PropTypes} from 'react';
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

const Root = ({store}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'application.*/
<StoreProvider store={store}>
    <Router history={hashHistory}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={AppConnectToStore} >
        {/* Le composant IndexRoute signifie qui sera appelé par défaut*/}
        <IndexRoute component={Home} />
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
</StoreProvider>;

Root.propTypes = {store: PropTypes.object.isRequired};

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('.focus-graph-demo-app')
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

Nous avons donc un composant `Root` qui va ressembler à ceci :

```jsx
import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route} from 'react-router'
import {Provider as StoreProvider} from 'react-redux';
/* Components */
import App from './app';
import Home from './views/home';
import User from './views/user';

const Root = ({store, history}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'application.*/
<StoreProvider store={store}>
    <Router history={history}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
      <Route path='/' component={App} >
        {/* Le composant IndexRoute signifie qui sera appelé par défaut*/}
        <IndexRoute component={Home} />
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
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

> A noter que cette partie n'est certainement pas présente dans le starter kit dans la mesure où tout est prêt pour un démarrage rapide.

- Afin d'initialiser l'application, nous avons besoin de définir les domaines et les définitions des entités.
- Pour cela nous mettons à disposition plusieurs `Providers`, par exemple pour les métadonnées, nous utilisons le `MetadataProvider`, à qui on doit fournir les domaines et les définitions des entités de l'application.

### Rappel les domaines

Les domaines servent à définir les domaines de valeurs des champs, ils portent une configuration ainsi qu'un ensemble de métadonnées.

On peut donc créer un fichier de config qui contiendra les domaines.
[Les domaines sont définis plus particulièrement ici](http://kleegroup.github.io/focus-docs/tutorial/surcharger-form-input.html).

> Pour information, vous pouvez insérer ce que vous souhaitez dans les domaines afin de le récupérer dans le composant cible.
> Je vous invite à lire [la superbe documentation dans le connecteur de metadata](https://github.com/get-focus/focus-graph/blob/master/src/behaviours/metadata.js#L71) :
> L'objectif de ces métadonnées est d'être fournies au composant générique `Field`

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
  name: {
    domain: 'DO_TEXTE',
    required: true
  }
  amount: {
    domain: 'DO_AMOUNT',
    required: true
  }
  currency: {
    domain: 'DO_SYMBOL',
    required: true
  }
  moves: {
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
- De la même manière que nous avons enrobé le routeur d'un provider de store, nous allons ajouter le provider de métadonnées.
- Nous allons ajouter les lignes suivantes afin de fournir à l'ensemble des composants fils le contenu des domaines et des définitions.

```jsx
import {Provider as MetadataProvider} from 'focus-graph/behaviours/metadata';
import * as definitions from './config/entity-definitions';
import * as domains from './config/domains';

// ...
<StoreProvider store={store}>
  <MetadataProvider definitions={definitions} domains={domains}>
    <Router history={history}>
      {/* On injecte comme composant d'application un composant connecté au store redux */}
        {/* Le composant IndexRoute signifie qui sera appelé par défaut*/}
        <Route path='/' component={App} >
        <IndexRoute component={Home}/>
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
      </Route>
    </Router>
  </MetadataProvider>
</StoreProvider>;
```

- Nous allons maintenant nous connecter au provider de métadonnées.
- Par exemple si nous nous plaçons dans le composant application qui est déjà connecté au store.

```jsx
import {compose} from 'redux'; // Pour composer les connecteurs
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';
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

## Faire une page avec la nouvelle manière de gérer le form.

- Avant de commencer, pour pouvoir utiliser le form il faut placer d'autres provider
- FieldHelpersProvider => Qui va nous servir à pouvoir récupérer les helper de form dans chacun des composants
- MasterDataProvider => Qui va nous servir à injecter des listes de références dans certaines parties de l'application.

Dans le composant root.

```jsx
import {Provider as MetadataProvider} from 'focus-graph/behaviours/metadata';
import {Provider as FieldHelpersProvider} from 'focus-graph/behaviours/field';
import {Provider as MasterDataProvider} from 'focus-graph/behaviours/master-data';
//...
const Root = ({store, history}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'application.*/
<StoreProvider store={store}>
  <MetadataProvider definitions={definitions} domains={domains}>
    <FieldHelpersProvider >
      <MasterDataProvider>
        <Router history={history}>
          {/* On injecte comme composant d'application un composant connecté au store redux */}
            {/* Le composant IndexRoute signifie qui sera appelé par défaut*/}
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

Afin d'utiliser les reducers que vous avez pu écrire, il est nécessaire d'utiliser la méthode `createStore` de redux qui est [documenté ici](http://redux.js.org/docs/api/createStore.html).


La création d'un store sert à :
- fournir une méthode pour dispatcher une action `dispatch`
- fournir une méthode pour s'abonner à des changements sur un store.
- Enregistrer l'arbre de reducer que vous avez produit afin que lorsqu'une action soit dispatchée, le nouveau state soit calculable via les reducers.
- Fournir les **enhancers** de store qui sont surtout les middlewares qui ont des buts variés et qu'il faut utiliser avec parcimonie.


```
dispatch(action) => middleware(action) => state = reducers(previousState, action)
```

> Petit aparté sur les middlewares, on a des middlewares dits :
> - **third-party :** qui vont amener à redux des fonctionnalités comme le log des actions, les devtools.
> - **custom :** dont le rôle est de réagir à certaines actions et d'en dispatcher de nouvelles lors de.

### Créer un store avec les comportements focus

Afin de vous aider au mieux au sein des projets, nous avons préparé un certain nombre de choses déjà prévues dans le store. Nous avons donc créé une méthode `createStoreWithFocus` qui ajoute les éléments suivants. `createStoreWithFocus(reducers, customMiddlewares, otherEnHancers) => createStore(reducers + focusReducers,customMiddlewares + focusmiddleWare + otherEnHancers + enhancersFocus)`

Voici ce que le `createStoreWithFocus` manipule.

- `reducers: {dataSet, customData}`
  - `dataSet` qui va contenir les reducers de données, qui seront populés lors des chargements de données
  - `customData` qui contiendra un morceau de state propre au projet qui sera libre en terme de contenu
  -  `...focusReducers` qui sont l'ensemble des reducers prévus par focus et prévus pour réagir aux différents connecteurs / providers / middlewares que nous proposons.
    - `master-data`: les reducers responsables de stocker les listes de références
    - `metadata`: les reducers responsables de stocker les domaines et les définitions
    - `form` qui contiendra la partie du state propre à chaque formulaire ou bloc de données indépendants. Ce morceau de state sera populé par les middlewares à chaque action comme chargement des données, sauvegarde des données, validation, saisie dans le champ, sortie de champ. Cette partie de state contient également l'ensemble des informations de chaque field de l'application comme : est-ce que le champ a changé, quel est sa valeur formatée, est ce qu'il est en édition, est ce qu'il a une erreur.
    > Pour plus d'informations, n'hésitez pas à aller voir la forme du state de chaque [form](https://github.com/get-focus/focus-graph/blob/6cb7b32f50caaa8ebbd093b1e24459a1b9e2f3b5/src/reducers/form.js#L22) et de chaque [field](https://github.com/get-focus/focus-graph/blob/6cb7b32f50caaa8ebbd093b1e24459a1b9e2f3b5/src/reducers/form.js#L31)

  - `...otherReducers` qui contiendra d'autres reducers que vous pouvez fournir pour les extensions par exemple.
- `middleware {customMiddlewares, formMiddleware, fieldMiddleware, thunkMiddleware}`
  - `customMiddlewares` l'ensemble des middlewares servant à faire un comportement métier _custom_ au projet. (Mettre à jour un champ en fonction d'un autre par exemple, un exemple détaillé est dans ce tutoriel)
  - `formMiddleware` le middleware responsable de la population du state propre au formulaire
  - `fieldMiddleware` le middleware responsable de la population de chaque field et de la réaction à chaque frappe, chaque changement de focus...
  - `thunkMiddleware` sert à pouvoir appeler des actions asynchrones. [Voir ici](https://github.com/gaearon/redux-thunk) pour de plus amples informations.
- `otherEnHancers` qui sert à fournir des enhancers à redux, typiquement le fait d'avoir des devtools redux.

### Exemple

Dans votre projet, vous allez créer un fichier `store.js` qui contiendra les éléments suivants :

```
import createStoreWithFocus from 'focus-graph/store/create-store';
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

Ensuite ce store sera fourni au `Provider` de store exposé par [react-redux](https://github.com/reactjs/react-redux).

> Le socle applicatif est maintenant prêt.
> On y va, on peut passer aux exemples !

---

[Première partie : votre premier formulaire](../tutorial-step-1/src/views/01-Formulaire simple/)
