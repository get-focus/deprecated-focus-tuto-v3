import React from 'react';
import AppConnectToStore from '../store';
import {IndexRoute, Router, Route, hashHistory} from 'react-router';

/* Components */
import MyApp from '../app';
import Home from '../views/home';
import User from '../views/user/user-form';
import FinanceView from '../views/user/finance-form';
import UserFinanceView from '../views/user/user-finance-form';
import UserFormCheckbox from '../views/user/user-form-checkbox';
import CustomFinanceUserForm from '../views/user/custom-finance-user-form';

/*
** Get the params and gives it to the USER VIEW
** const paramExtractor = Component => props => <Component id={props.params.id} />
** const UserWithParam = paramExtractor(User);
** USE : <Route path='user/:id' component={UserWithParam} />
*/

/**
* The router which takes views by given URL
* @type {[type]}
*/
const router = <Router history={hashHistory}  key='router'>
  <Route path='/' component={MyApp} key='mainRoute' >
    <IndexRoute component={Home}/>
    // ":id" is used to give a parameter to the URL. We get the parameters via the "params'" props
    // Here is the classical way to do
    <Route path='user/:id' component={({params}) => <User id={params.id}/>} />
    <Route path='finance/:id' component={({params}) => <FinanceView id={params.id}/>} />
    <Route path='user/finance/:id' component={({params}) => <UserFinanceView id={params.id}/>} />
    <Route path='user/select/:id' component={({params}) => <UserFormCheckbox id={params.id}/>} />
    <Route path='user/list/:id' component={({params}) => <CustomFinanceUserForm id={params.id}/>} />
  </Route>
</Router>;


export default router;
