import React, {PropTypes, Component} from 'react';
import RootProvider from './components/RootProvider'

class Root extends Component {
  render(){
    return <RootProvider {...this.props}/>
  }
}

Root.propTypes = {store: PropTypes.object.isRequired};

export default Root;
