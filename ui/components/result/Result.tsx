import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { IPrimaryAsset, ISecondaryAsset } from '../../../data/modules/typeDefinition';
import CircularProgress from 'material-ui/CircularProgress';

interface IProps {
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  isConvertAssetEnabled: boolean;
  fetchAssetsPrices(): () => Promise<void>;
}

class Result extends React.Component<IProps, {open: boolean}> {
  readonly state  = {
    open: false,
  };

  private handleOpen = () => {
    this.props.fetchAssetsPrices();
    this.setState({ open: true });
  }

  private handleClose = () => {
    this.setState({ open: false });
  }

  public render() {

    return (
      <div>

        <RaisedButton
          label="Convert assets"
          primary={true}
          disabled={!this.props.isConvertAssetEnabled}
          onClick={this.handleOpen}
        />

        <Dialog
          title="result"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          {this.props.secondaryAsset.amount ?
            <div>
              <span>for {this.props.primaryAsset.amount} {this.props.primaryAsset.asset.symbol} </span>
              <span>you can get {this.props.secondaryAsset.amount} {this.props.secondaryAsset.asset.symbol}</span>
            </div> :
            <CircularProgress size={80} thickness={5} />
          }
        </Dialog>
      </div>
    );
  }
}

export default Result;
