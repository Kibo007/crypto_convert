import * as React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapActionToDispatch, IMapStateToProps } from '../../data/modules/app';
import './app.scss';
import './../styles/layout.scss';

import AssetSelect from './../components/assetSelect/AssetSelect';
import NavigationBar from './../components/navigationBar/NavigationBar';

import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';

interface IProps extends IMapStateToProps {
  fetchAssets(): () => any;
  updatePrimarySelectedAsset(): () => any;
  updatePrimaryAssetAmount(): () => any;
  updateSecondarySelectedAsset(): () => any;
}

class App extends React.Component<IMapStateToProps & IProps, {}> {

  componentWillMount() {
    this.props.fetchAssets();
  }

  public render() {
    return (
      <div>
        <NavigationBar title="Crypto convert"/>
        <List>
          <div data-layout="column" data-layout-align="center center">
            <TextField
              floatingLabelText="Amount of assets to convert"
              hintText="0"
              floatingLabelFixed={false}
              type="number"
            />
            <br/>
            <AssetSelect
              assets={ this.props.assets }
              selectedAsset={ this.props.primaryAsset.asset }
              updateSelectedAsset={ this.props.updatePrimarySelectedAsset }
            />
          </div>

          <br/>
          <br/>
          <Divider/>

          <div data-layout="column" data-layout-align="center center">
            {/*<AssetSelect/>*/}
          </div>

        </List>
      </div>
    );
  }
}

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export default connect(mapStateToProps, mapActionToDispatch, mergeProps)(App);
