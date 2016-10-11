import React, {PureComponent, PropTypes} from 'react';

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
