import React, {Component} from 'react';
import Card from './user/card';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
    {route: '/finance/120', destination: 'Finance List', description: 'Exemple d\'un formulaire avec un ListFor', title: 'Finance List'}
];

const Home = props =>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
    </div>;
export default Home;
