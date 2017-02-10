import React from 'react';
import {IndexRoute, Router, Route} from 'react-router';
import {hashHistory} from 'react-router';

/* Components */
import Layout from '../containers/layout';
import Home from '../views/home';
import Finance from '../views/user/finance-form';

const RouterRoot = <Router history={hashHistory} key='router'>
    <Route path='/' component={Layout} key='mainRoute' >
        <IndexRoute component={Home}/>
        <Route path='finance/:id' component={({params}) => <Finance id={params.id}/>} />
    </Route>
</Router>;

//{/* On injecte comme composant d'application un composant connecté au store redux */}
//{/* Le composant IndexRoute signifie qui sera appelée par défaut*/}
export default RouterRoot;
