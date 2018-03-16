import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { IPrimaryAsset, ISecondaryAsset } from '../../../data/modules/typeDefinition';
import CircularProgress from 'material-ui/CircularProgress';
const styles = require('./result.scss');

type Error = {
  message: string;
};

interface IProps {
  loading: boolean;
  error: Error;
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
    const { primaryAsset, secondaryAsset, error } = this.props;
    return (
      <div>

        <RaisedButton
          label="Convert assets"
          primary={true}
          disabled={!this.props.isConvertAssetEnabled}
          onClick={this.handleOpen}
        />

        <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          {this.props.loading ?
            <div className={styles.loader}>
              <CircularProgress size={80} thickness={5} />
            </div> :
            <div className={styles.result}>
              {error.message.length === 0 ?
                <p>
                  For <span className={styles.asset}>{primaryAsset.amount} {primaryAsset.asset.symbol} </span>
                  you can get <span className={styles.asset}>{secondaryAsset.amount} {secondaryAsset.asset.symbol}</span>
                </p> :
                <p>{error.message}</p>
              }
            </div>
          }
        </Dialog>
      </div>
    );
  }
}

export default Result;
