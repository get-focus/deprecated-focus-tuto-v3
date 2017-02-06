import React, {Component} from 'react';
import Card from './user/card';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
    {route: '/user/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'},
    {route: '/finance/120', destination: 'Finance List', description: 'Exemple d\'un formulaire avec un ListFor', title: 'Finance List'},
    {route: '/user/finance/120', destination: 'user finance', description: 'Exemple d\'un formulaire avec deux noeuds', title: 'User finances'},
    {route: '/user/list/120', destination: 'Custom data', description: 'Exemple d\'utitlisation d\'un custom midlleware', title: 'Custom data'},
    {route: '/user/component/120', destination: 'user refs', description: 'Formulaire avec différents composants', title: 'User Components'}
];

const Home = props =>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
    </div>;
export default Home;
