import * as React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapActionToDispatch } from '../../data/modules/app';
import './app.scss';
import './../styles/layout.scss';

import AssetSelect from './../components/assetSelect/AssetSelect';
import NavigationBar from './../components/navigationBar/NavigationBar';

import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';

interface IProps {
  assets: object;
  fetchAssets(): Function;
}

class App extends React.Component<IProps, {}> {

  componentWillMount() {
    this.props.fetchAssets();
  }

  public render() {
    return (
      <div>
        <NavigationBar title="Crypto convert"/>
        <List>
          <div data-layout="column" data-layout-align="center center" >
            <TextField
              floatingLabelText="Amount of assets to convert"
              hintText="0"
              floatingLabelFixed={false}
              type="number"
            />
            <AssetSelect />
          </div>

          <Divider />

          <div data-layout="column" data-layout-align="center center" >
            <AssetSelect />
          </div>

        </List>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapActionToDispatch)(App);
