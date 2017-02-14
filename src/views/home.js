import React, {Component} from 'react';
import {compose} from 'redux';
import {Link} from 'react-router';
import Panel from 'focus-components/panel';
import Button from 'focus-components/button';

const routes = [
    {route: '/user/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'}
];

const Home = props => {
    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
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
