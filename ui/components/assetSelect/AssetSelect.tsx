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
import { List } from 'react-virtualized';

interface IProps {
  primaryAsset?: IPrimaryAsset;
  assets: IAsset[];
  selectedAsset: IAsset;
  assetSearch: string;
  updateSelectedAsset(asset: IAsset): IUpdateSecondarySelectedAsset | IUpdatePrimarySelectedAsset;
  updateAssetSearch(value: string): IAssetSearch;
}

class AssetSelect extends React.Component<IProps, { open: boolean }> {
  readonly state = {
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

  private rowRenderer = ({ key, index }: {key: any, index: any}) => {
    return (
      <li key={key}
          onClick={() => this.updateAsset(this.props.assets[index])}
          data-layout="row" data-layout-align="space-between center"
          className={styles.asset}
      >
        <img className={styles.image} src={this.props.assets[index].imageUrl} alt={this.props.assets[index].coinName}/>
        <span>{this.props.assets[index].symbol}</span>
        <span>{this.props.assets[index].coinName}</span>
      </li>
    );
  }

  public render() {
    const hasSelectedAsset = this.props.selectedAsset.symbol.length > 0;


    return (
      <div>
        {hasSelectedAsset ?
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
          <RaisedButton label="select asset" onClick={this.handleOpen}/>
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
          <List
            height={500}
            width={300}
            rowCount={this.props.assets.length}
            rowHeight={50}
            rowRenderer={this.rowRenderer}
          />

        </Dialog>
      </div>
    );
  }
}

// Wrap your component with the HOC.
export default AssetSelect;

