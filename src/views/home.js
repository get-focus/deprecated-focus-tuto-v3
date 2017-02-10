import React, {Component} from 'react';
import Card from './user/card';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
    {route: '/user/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'}
];

const Home = props =>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
    </div>;
export default Home;
