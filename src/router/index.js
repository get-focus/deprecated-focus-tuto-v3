import React from 'react';
import {IndexRoute, Router, Route} from 'react-router';

/* Components */
import App from '../app';
import Home from '../views/home';
import User from '../views/user/user-form';
import FinanceView from '../views/user/finance-form';

import {hashHistory } from 'react-router';
const paramExtractor = Component => props => <Component id={props.params.id} />
const UserWithParam = paramExtractor(User);

const router = <Router history={hashHistory}  key='router'>
  <Route path='/' component={App} key='mainRoute' >
    <IndexRoute component={Home}/>
    {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
    <Route path='user/:id' component={UserWithParam} />
    <Route path='finance/:id' component={({params}) => <FinanceView id={params.id}/>} />
  </Route>
</Router>;

//{/* On injecte comme composant d'application un composant connecté au store redux */}
//{/* Le composant IndexRoute signifie qui sera appellée par défaut*/}
export default router;
