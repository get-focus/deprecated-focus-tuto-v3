import React, {PureComponent, PropTypes} from 'react';
import compose from 'lodash/flowRight';
import Panel from 'focus-components/panel';

import {confirm} from 'focus-application/confirm/confirm-actions';

const User = () => (
  <div>
    <Panel title='User'>
      Bien le bonjour
    </Panel>
  </div>
);

class SmartUser extends PureComponent {
  render() {
    return (
      <User/>
    );
  }
};

User.displayName = 'SmartUser ';

export default SmartUser;
