import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

type Asset = {
  symbol: string;
  imageUrl: string;
  coinName: string;
};

interface IProps {
  assets: Asset[];
  selectedAsset: Asset;
  updateSelectedAsset(): () => any;
}

class AssetSelect extends React.Component<IProps, {}> {
  state: { open: boolean } = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
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
          title="Scrollable Dialog"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <ul>
            {this.props.assets.map((asset: Asset, i: number) => {
              return (
                <li key={i} onClick={this.handleClose}>
                  {asset.symbol} {asset.coinName}
                  <img src={asset.imageUrl} alt={asset.coinName}/>
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
