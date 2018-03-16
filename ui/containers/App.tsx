import * as React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapActionToDispatch } from '../../data/modules/app';
import { IMapDispatchToProps, IMapStateToProps } from '../../data/modules/typeDefinition';

import './app.scss';
import './../styles/layout.scss';

import AssetSelect from './../components/assetSelect/AssetSelect';
import NavigationBar from './../components/navigationBar/NavigationBar';
import Result from './../components/result/Result';

import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';

interface IProps extends IMapStateToProps, IMapDispatchToProps {}

class App extends React.Component<IProps, {}> {

  componentWillMount() {
    this.props.fetchAssets();
  }

  public render() {
    const { primaryAsset, secondaryAsset, assets, assetSearch } = this.props;
    const isConvertAssetEnabled = primaryAsset.asset.symbol.length > 0
      && primaryAsset.amount > 0
      && secondaryAsset.asset.symbol.length > 0;

    return (
      <div>
        <NavigationBar title="Crypto convert"/>
        <List>
          <div data-layout="column" data-layout-align="center center">
            <TextField
              floatingLabelText="Add amount of assets to convert"
              inputStyle={{ textAlign: 'center' }}
              type="number"
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  this.props.updatePrimaryAssetAmount(e.target.value)
              }
              value={primaryAsset.amount}
            />
            <br/>
            <AssetSelect
              assets={assets}
              selectedAsset={primaryAsset.asset}
              updateSelectedAsset={this.props.updatePrimarySelectedAsset}
              updateAssetSearch={this.props.updateAssetSearch}
              assetSearch={assetSearch}
            />
          </div>

          <br/>
          <br/>
          <Divider/>
          <br/>
          <br/>

          <div data-layout="column" data-layout-align="center center">
            <AssetSelect
              assets={assets}
              selectedAsset={secondaryAsset.asset}
              updateSelectedAsset={this.props.updateSecondarySelectedAsset}
              updateAssetSearch={this.props.updateAssetSearch}
              assetSearch={assetSearch}
            />
          </div>

          <br/>
          <br/>

          <div data-layout="column" data-layout-align="center center">
            <Result
              fetchAssetsPrices={this.props.fetchAssetsPrices}
              secondaryAsset={secondaryAsset}
              primaryAsset={primaryAsset}
              isConvertAssetEnabled={isConvertAssetEnabled}
            />
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
