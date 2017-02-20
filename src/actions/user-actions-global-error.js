import {actionBuilder} from 'focus-graph/actions/entity-actions-builder';

import {loadUser, saveUser, loadError} from '../services';

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _loadUserAction = actionBuilder({names: ['user'], type: 'load', service: loadUser});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const loadUserTypes = _loadUserAction.types;
export const loadUserAction = _loadUserAction.action;

// Création de l'action de Load via un tableau de node pour le store redux, un type d'action et un service associé
const _saveUserAction = actionBuilder({names: ['user'], type: 'save', service: saveUser});
//En retour on a l'action à appelé dans la vue, et les types des actions redux crées à donner au reduce redux
export const saveUserTypes = _saveUserAction.types;
export const saveUserAction = _saveUserAction.action;

const _loadUserErrorAction = actionBuilder({names: ['user'], type: 'load', service: loadUser});
export const loadUserErrorTypes = _loadUserErrorAction.types;
export const loadUserErrorAction = _loadUserErrorAction.action;

const _saveErrorUserAction = actionBuilder({names: ['user'], type: 'save', service: loadError});
export const saveErrorUserTypes = _saveErrorUserAction.types;
export const saveErrorUserAction = _saveErrorUserAction.action;
