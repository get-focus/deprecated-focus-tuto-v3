# D'autres composants

Cette partie s'intéresse à mettre en musique d'autres composants de formulaires.

Le formulaire créé affichera comme nouveaux composants :
- un champs [date](https://github.com/get-focus/focus-components/tree/develop/src/input-date),
- un champs [select checkbox](https://github.com/get-focus/focus-components/tree/develop/src/select-checkbox),
- un champ [autocomplete](https://github.com/get-focus/focus-components/blob/develop/src/autocomplete-text/field.js)

## La vue

Nous avons besoin d'un composant React : User.

```jsx
// views/user/user-form.js

```

## Les actions

Nous avons deux actions à écrire le load et le save. Il est alors possible d'utiliser l'actionBuilder. Nous préconisons l'utilisation de ce dernier, mais ce n'est pas une obligation.

```jsx

```

## Les services

```jsx
// services/user-service.js

```

## Les reducers

Pour rappel un reducer est une fonction pure (pas liée à un contexte, dans d'autres termes une fonction `static` !) avec une signature très simple :
		`(previousState, action) => newState`

```jsx
// reducer/user-reducer.js

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

> De la même façon que l'actionBuilder, le reducerBuilder permet de simplifier les développements. Cependant son utilisation n'est pas obligatoire.

![capture](https://cloud.githubusercontent.com/assets/10349407/16381193/944d89fe-3c7b-11e6-9c05-d1b6c1d49a02.PNG)

---

[Prochaine partie : les erreus globales](../06-Erreurs globales/)
