import React, {PropTypes, Component} from 'react';
import {Provider as StoreProvider} from 'react-redux';
import router from './router';

const RootPure = ({store}) => /*On place le provider de store au plus haut afin de pouvoir injecter des informations du store dans toute l'applciation.*/
<StoreProvider store={store}>
  {router}
</StoreProvider>;

RootPure.propTypes = {
  //history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

class Root extends Component {
  render(){
    return <RootPure {...this.props}/>
  }
}

export default Root;
