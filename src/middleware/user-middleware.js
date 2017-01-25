import rootReducer from '../reducer';
import {INPUT_CHANGE, INPUT_ERROR, MY_ACTION} from 'focus-graph/actions/input';


// export const toUpperCaseMiddleware = store => next => action => {
//   //On récupère les informations que l'on souhaite dans le state Redux
//   const {forms, definitions, domains} = store.getState();
//   //On recherche l'action souhaitée sur le champs souhaité afin de réaliser notre action
//   if (action.type === INPUT_CHANGE && action.fieldName == 'amount') {
//     // L'objet action est celui décrit dans les actions [focus-graph](https://github.com/get-focus/focus-graph/blob/master/src/actions/form.js)
//     const {formKey} = action;
//     const {fields} = forms.find(f=> f.formKey === formKey);
//     //On met en forme notre nouvelle action
//     const lastNameAction = {...action};
//     lastNameAction.fieldName = 'name';
//     lastNameAction.rawValue =  fields.find(f => f.name == 'name').rawInputValue.toUpperCase();
//     //On réalise la première action
//     next(action);
//     //On dispatch l'action que nous avons créée
//     store.dispatch(lastNameAction);
//   } else {
//     //Dans tous les autres cas d'action, on realise l'action sans modification
//     next(action);
//   }
// }

export const errorFieldMiddleware = store => next => action => {
    const {forms, definitions, domains} = store.getState();
    if (action.type === INPUT_CHANGE && action.fieldName == 'amount') {
        const errorAction = {};
        errorAction.type = 'INPUT_ERROR';
        errorAction.formKey = action.formKey;
        errorAction.fieldName = 'name';
        errorAction.entityPath = action.entityPath;
        errorAction.error = "Une erreur venue de l'espace !! "
        next(action);
        store.dispatch(errorAction);
    } else {
        next(action);
    }
}

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
