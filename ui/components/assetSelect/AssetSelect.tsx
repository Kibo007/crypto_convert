import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { IPrimaryAsset } from '../../../data/modules/app';
// import styles from './assets-search.scss';
const styles = require('./assets-search.scss');

type Asset = {
  symbol: string;
  imageUrl: string;
  coinName: string;
};

interface IProps {
  primaryAsset?: IPrimaryAsset;
  assets: Asset[];
  selectedAsset: Asset;
  assetSearch: string;
  updateSelectedAsset(): () => any;
  updateAssetSearch(value: string): () => any;
}

class AssetSelect extends React.Component<IProps, {open: boolean}> {
  readonly state  = {
    open: false,
  };

  private handleOpen = () => {
    this.setState({ open: true });
  };

  private handleClose = () => {
    this.setState({ open: false });
  };

  public render() {
    const hasSelectedAsset = this.props.selectedAsset.symbol.length > 0;
    return (
      <div>
        { hasSelectedAsset ?
          <div onClick={this.handleOpen}>
            {this.props.selectedAsset.symbol} {this.props.selectedAsset.coinName}
            <img src={this.props.selectedAsset.imageUrl} alt={this.props.selectedAsset.coinName}/>
          </div> :
          <RaisedButton label="select asset" onClick={this.handleOpen} />
        }

        <Dialog
          title={<TextField
            floatingLabelText="Search for asset by symbol"
            hintText="ETN"
            floatingLabelFixed={false}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>) =>
                this.props.updateAssetSearch(e.target.value)
            }
            value={this.props.assetSearch}
          />}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <ul>
            {this.props.assets.map((asset: Asset, i: number) => {
              return (
                <li key={i}
                    onClick={this.handleClose}
                    data-layout="row" data-layout-align="space-between center"
                    className={styles.asset}
                >
                  <img className={styles.image} src={asset.imageUrl} alt={asset.coinName}/>
                  <span>{asset.symbol}</span>
                  <span>{asset.coinName}</span>
                </li>
              );
            })}
          </ul>
        </Dialog>
      </div>
    );
  }
}

export default AssetSelect;
