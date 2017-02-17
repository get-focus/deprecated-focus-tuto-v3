import React, {Component} from 'react';
import {compose} from 'redux';
import {Link} from 'react-router';
import Panel from 'focus-components/panel';
import Button from 'focus-components/button';

const routes = [
    {route: '/users/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'},
    {route: '/finances/120', destination: 'Finance List', description: 'Exemple d\'un formulaire avec un ListFor', title: 'Finance List'},
    {route: '/users/finances/120', destination: 'user finance', description: 'Exemple d\'un formulaire avec deux noeuds', title: 'User finance'},
    {route: '/users/lists/120', destination: 'Custom data', description: 'Exemple d\'utilisation d\'un custom midlleware', title: 'Custom data'},
    {route: '/users/component/120', destination: 'user components', description: 'Formulaire avec différents composants', title: 'User Components'}
    {route: '/user/error/120', destination: 'Error', description: 'Composant user avec une error', title: 'Error'}
];

const Home = props => {
    return (
        <div data-component='homeCard'>
            {routes.map(route => <div key={route.route} style={{margin: '10px'}}>
                <Panel title={route.title} Buttons={null}>
                    <p>{route.description}</p>
                    <div className="mdl-card__actions mdl-card--border">
                        <Link to={route.route} className="mdl-button mdl-button--colored">
                            {route.destination}
                        </Link>
                    </div>
                </Panel>
            </div>)}
        </div>
    )
}

export default Home;
