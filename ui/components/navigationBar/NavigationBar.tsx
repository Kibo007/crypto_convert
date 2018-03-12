import * as React from 'react';
import AppBar from 'material-ui/AppBar';

interface NavigationBarProps {
  title: string,
}

const NavigationBar: React.SFC<NavigationBarProps> = props => (
  <div>
    <AppBar
      title={props.title}
    />
  </div>
);

export default NavigationBar;