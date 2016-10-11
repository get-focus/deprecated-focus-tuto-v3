import React, {PropTypes} from 'react';

import {connect as connectToStore} from 'react-redux';
import {connect as connectToMetadata} from 'focus-graph/behaviours/metadata';

/**
 * Le compose donne la possibilité d'enchaîner plusieurs fonctions
 * Ici nous enchaîneront les "connect"
 */
import {compose} from 'redux';
import AppLayout from './containers/layout';

// Ceci est un sélecteur de state, il sera localisé près de son reducer plus tard.
const userSelector = state => ({...state.user});

// On crée le composant Application
const App = props => <AppLayout {...props} />;

App.defaultProps = {
  name: ''
}

App.propTypes = {
  name: PropTypes.string.isRequired
}
// On exporte le composant Application connecté au store redux.

export default compose(
  connectToStore(userSelector),
  connectToMetadata(['user','address','financialMove'])
)(App);
