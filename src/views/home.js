import React, {Component} from 'react';
import Card from './user/card';
import {connect as connectToForm } from 'focus-graph/behaviours/form';
import {injectActionHeader, triggerPosition} from 'focus-application/header/header-actions';
import {compose} from 'redux';
import {Link} from 'react-router';

const routes = [
  {route: '/user/120', destination: 'user', description: 'Formulaire classique avec liste de référence', title: 'User form'},
  {route: '/finance/120', destination: 'Finance List', description: 'Exemple d\'un formulaire FINANCE', title: 'Finance List'},
  {route: '/user/finance/120', destination: 'user finance', description: 'Exemple d\'un formulaire USER-FINANCE', title: 'User finances'},

];

const actions = {
  primary: [
    {icon: 'face', label: 'face', action: () => window.location.href = '/#/user/120/'},
    {icon: 'account_balance_wallet', label: 'wallet', action: () => window.location.href = '/#/finance/120/'}
  ],
  secondary: [
    {label: 'Informations', action: () => console.log('User Form')},
    {label: 'Settings', action: () => console.log('User Form')}
  ]
}

class Home extends Component {
  componentWillMount() {
    window.scrollTo(0, 0);
    const {injectActionHeader, triggerPosition} = this.props;
    triggerPosition(0);
    injectActionHeader(actions);
  }

  render() {
    return(
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {routes.map(route => <Card key={route.route} {...route} />)}
      </div>
    );
  }
}

const formConfig = {
  formKey: 'homeForm',
  entityPathArray: ['user'],
  mapDispatchToProps: {injectActionHeader, triggerPosition}
};

const ConnectedHome = compose(
  connectToForm(formConfig)
)(Home);

// const Home = props => <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>{routes.map(route => <Card key={route.route} {...route} />)}</div>;
export default ConnectedHome;
