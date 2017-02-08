# Les Middlewares
Je vous recommande la documentation de redux : http://redux.js.org/docs/advanced/Middleware.html
qui vous sera d'une grande aide si vous avez un doute sur les middlewares.
N'hésitez pas à relire également la documentation sur le createStoreWithFocus.

Vous voulez avoir, en fonction d'une action, un comportement particulier, une logique autre : le middleware est là pour vous. Nous allons pour cela mettre en place trois middlewares d'exemple :

 - Un middleware qui permet lors d'une action de réaliser la même action sur un autre champ
 - Un middleware qui permet lors d'une action de réaliser une autre action du form.
 - Un middleware qui permet lors d'une action de réaliser une autre action que nous avons écrit.

## Middleware de base :

 Prenons un exemple précis. Lorsqu'un input particulier vient à changer et que ce changement doit mettre en majuscules un autre input (oui oui, ce cas arrive tous les jours), c'est dans le middleware que tout va se jouer.
Pour cela deux étapes :

- Ecrire le middleware :
Vous pouvez créer un dossier middleware et écrire dans notre cas :
```jsx
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

export default amoutToUpperCaseMiddleware;
```
IL est très simple, via les middlewares, de se placer avant ou après une action, afin de réaliser des modifications. Il suffit pour cela de récupérer l'action qui nous intéresse, de créer la nouvelle action, de réaliser la première et enfin de dispatcher l'action créée (qui passera aussi dans les middlewares).

- L'ajouter lors de la création du store :

Pour cette partie, je vous invite à relire la partie sur le store Redux et sur le [createStoreWithFocus](https://github.com/get-focus/focus-tuto-redux/blob/master/README.md#dernier-point-avant-de-se-lancer-on-va-créer-un-store-un-peu-plus-avancé)

```jsx
import createStoreWithFocus from 'focus-graph/store/create-store';
import rootReducer from '../../src/reducer';
import {amoutToUpperCaseMiddleware} from '../../src/middleware/user-middleware';

// ...VOTRE CODE...

const store = createStoreWithFocus({dataset: rootReducer}, [amoutToUpperCaseMiddleware]);

export default store;
```
> Le tour est joué ! C'est magique non ?

## Middleware, deuxième exemple

Il est également possible de dispatcher une autre action. Il suffit pour cela de réaliser la même chose que précédemment en ajoutant seulement un autre type et en respectant le contract défini par les [actions](https://github.com/get-focus/focus-graph/blob/master/src/actions/form.js) du form. Il est possible de mettre en place toutes actions disponibles du form.

```jsx
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

sans oublier de l'injecter lors de la construction du store :

```jsx
import builder from 'focus-graph/store/builder';
import rootReducer from '../../src/reducer';
import {amoutToUpperCaseMiddleware, errorFieldMiddleware} from '../../src/middleware/user-middleware';

const store = builder(rootReducer, [amoutToUpperCaseMiddleware, errorFieldMiddleware]);

export default store;
```

## Un troisième pour la route !

> En pratique ce troisième cas ne sera pas le plus utilisé, mais c'est toujours bien de savoir que c'est possible. Qui plus est, ça montre d'autant plus la force de redux (au cas où vous ne seriez pas encore convaincu).

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

- L'action custom :

Une action au sens redux du terme ça ressemble à ça. En effet pour les actions spécifiques du load et du save l'actionBuilder est là pour vous simplifier les développements cependant, pour des actions "simples", voici ce que vous devez écrire. Une action doit toujours avoir un type, ce type étant le descriminant pour les reducers. Puis elle contient les informations nécessaires au reducer pour transformer le state. Pour cet exemple la clé du formulaire est suffisant, maintenant vous pouvez tout aussi bien lui donner autre chose.

```jsx

//actions/custom-actions.js
export const MY_ACTION = 'MY_ACTION';

export const customAction = (formKey) => {
  type: MY_ACTION,
  formKey
}
```
- Le reducer :

De la même façon qu'avec l'action, le reducerBuilder n'est pas utile ici. Cependant il est important de comprendre qu'un reducer agit sur une partie du state et donc vous devrez indiquer ici tout les reducers dont vous avez besoin pour agir sur cette partie du state en particulier, il faudra alors réaliser un switch en fonction des différentes actions disponibles pour cette partie du state. Nous en avons qu'une seule ici, mais il n'est pas exclu d'en avoir plusieurs.

Lorsque l'action MY_ACTION est dipatchée par notre middleware, le reducer va ajouter un message de victoire dans le state, sinon il ajoutera un autre message d'échec... Il faut maintenant ajouter notre reducer dans le combineReducer. C'est à ce moment-là qu'on définira le nœud du store, et donc le nom dans le state. Vous allez voir c'est très simple.

```jsx
//reducer/custom-reducer.js
import {MY_ACTION} from '../actions/custom-actions';

 const customReducer = (state = {}, action) => {
    switch(action.type) {
        case MY_ACTION:
          return {victoire: 'De la Gloire'};
        default:
          return {echec: 'De l'échec' };
    }
};

export default customReducer;
```

> A noter : il est important de se rappeler que le state redux est un objet immutable et ainsi vous devez toujours renvoyer un nouvel objet et non modifier le premier.

- Le combineReducer :

Il vous suffit d'ajouter votre reducer lors de la déclaration de votre store dans le customData :

```jsx
import customReducer from './custom-reducer'
const store = builder({dataset: rootReducer, customData: customReducer}, [lastNameMiddleware, ownActiondMiddleware], [DevTools.instrument()]);
```

Et voilà, le tour est joué. Notre information se trouvera donc dans customData.

- Le connecteur :

Un dernier petit effort, c'est presque fini ! Donc maintenant que notre information est dans notre store, il faut récupérer cette information, souvenez-vous de nos amis les connecteurs. Notre vue doit se connecter à cette information du state, on se place alors dans celle-ci en se concentrant sur les connecteurs :

```jsx
import {connect as connectToState} from 'react-redux';
import {selectData} from 'focus-graph/store/create-store';

[...]

const ConnectedUserForm = compose(
    connectToState(selectData('customData'))
    connectToMetadata(['user', 'financialMove', 'finance']),
    connectToForm(formConfig),
    connectToFieldHelpers()
)(SmartUserFinance );
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

> Pour rappel et pour conclure cette partie sur les middlewares, le principal c'est de comprendre qu'un middleware a accès au state dans sa globalité et qu'il fonctionnne dans un context donné, à l'inverse d'un reducer qui est pur et ne travaille que sur une partie de state pour en donner une autre. Les deux sont à utiliser pour des cas différents, et il n'est pas superflu de se poser les bonnes questions avant de choisir l'un ou l'autre.

---

[Prochaine partie : les autres composants](../05-Autres%20composants/)
