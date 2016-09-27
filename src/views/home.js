import React from 'react';
import Card from './user/card';

const routes = [
  {route: '/user/120', destination: 'User', description: 'Premier Form', title: 'Form'}

];

const Home = props => <div style={{display: 'flex', flexWrap: 'wrap'}}>{routes.map(route => <Card key={route.route} {...route} />)}</div>;

export default Home;
