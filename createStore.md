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

Afin de vous aider au mieux au sein des projets nous avons préparé un certain nombre de chose déjà prévue dans le store. Nous avons donc crée une méthode `createStoreWithFocus` qui ajoute les éléments suivants. `createStoreWithFocus(reducers, customMiddlewares, otherEnHancers)`


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
import createStoreWithFocus from '../../src/reducer';
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

Ensuite ce store sera fournie au `Provider` de store exposé par `react-redux`.
