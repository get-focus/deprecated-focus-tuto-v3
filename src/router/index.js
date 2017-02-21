import React from 'react';
import {IndexRoute, Router, Route} from 'react-router';
import {hashHistory} from 'react-router';

/* Components */
import Layout from '../containers/layout';
import Home from '../views/home';
import User from '../views/user/user-form';
import Finance from '../views/user/finance-form';
import UserFinanceView from '../views/user/user-finance-form';
import CustomFinanceUserForm from '../views/user/custom-finance-user-form';

const RouterRoot = <Router history={hashHistory} key='router'>
    <Route path='/' component={Layout} key='mainRoute' >
        <IndexRoute component={Home}/>
        {/* Les :id sert à fournir un paramètre à l'url on extrait les paramètres d'url via la props params*/}
        <Route path='users/:id' component={({params}) => <User id={params.id}/>} />
        <Route path='finances/:id' component={({params}) => <Finance id={params.id}/>} />
        <Route path='users/finances/:id' component={({params}) => <UserFinanceView id={params.id}/>} />
        <Route path='users/lists/:id' component={({params}) => <CustomFinanceUserForm id={params.id}/>} />
    </Route>
</Router>;

//{/* On injecte comme composant d'application un composant connecté au store redux */}
//{/* Le composant IndexRoute signifie qui sera appelée par défaut*/}
export default RouterRoot;
