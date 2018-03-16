import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {
  IPrimaryAsset,
  IAsset,
  IUpdateSecondarySelectedAsset,
  IUpdatePrimarySelectedAsset,
  IAssetSearch,
} from '../../../data/modules/typeDefinition';
const styles = require('./assets-search.scss');

interface IProps {
  primaryAsset?: IPrimaryAsset;
  assets: IAsset[];
  selectedAsset: IAsset;
  assetSearch: string;
  updateSelectedAsset(asset: IAsset): IUpdateSecondarySelectedAsset | IUpdatePrimarySelectedAsset;
  updateAssetSearch(value: string): IAssetSearch;
}

class AssetSelect extends React.Component<IProps, {open: boolean}> {
  readonly state  = {
    open: false,
  };

  private handleOpen = () => {
    this.setState({ open: true });
  }

  private handleClose = () => {
    this.setState({ open: false });
  }

  private updateAsset = (asset: IAsset) => {
    this.props.updateSelectedAsset(asset);
    this.handleClose();
  }

  public render() {
    const hasSelectedAsset = this.props.selectedAsset.symbol.length > 0;
    return (
      <div>
        { hasSelectedAsset ?
          <div
            onClick={this.handleOpen}
            className={styles.selectedAsset}
            data-layout="row" data-layout-align="space-between center"
          >
            <img
              className={styles.image}
              src={this.props.selectedAsset.imageUrl}
              alt={this.props.selectedAsset.coinName}
            />
            <span>{this.props.selectedAsset.symbol}</span>
            <span>{this.props.selectedAsset.coinName}</span>
          </div> :
          <RaisedButton label="select asset" onClick={this.handleOpen} />
        }

        <Dialog
          title={<TextField
            className={styles.search}
            floatingLabelText="Search by symbol"
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
            {this.props.assets.map((asset: IAsset, i: number) => {
              return (
                <li key={i}
                    onClick={() => this.updateAsset(asset)}
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
