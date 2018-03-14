import 'isomorphic-fetch';
import { bindActionCreators, Dispatch, Reducer } from 'redux';
import { MainState } from './../store';

// ---------------------------------------------------------------------------------------------
// ----------------------------     Action type     --------------------------------------------
// ---------------------------------------------------------------------------------------------

enum ActionTypes {
  ALL_ASSETS_FETCHED = 'ALL_ASSETS_FETCHED',
  UPDATE_PRIMARY_SELECTED_ASSET = 'UPDATE_PRIMARY_SELECTED_ASSET',
  UPDATE_PRIMARY_ASSET_AMOUNT = 'UPDATE_PRIMARY_ASSET_AMOUNT',
  UPDATE_SECONDARY_SELECTED_ASSET = 'UPDATE_SECONDARY_SELECTED_ASSET',
  ERROR_LOADING_ASSETS = 'ERROR_LOADING_ASSETS',
  LOADING = 'LOADING',
}

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------
interface IObject {
  payload: object;
}

interface IAssetsFetched extends IObject{
  type: ActionTypes.ALL_ASSETS_FETCHED;
}

const assetsFetched = (assets: object): IAssetsFetched => ({
  type: ActionTypes.ALL_ASSETS_FETCHED,
  payload: assets,
});

interface IUpdatePrimaryAssetAmount {
  type: ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT;
  payload: number;
}

const updatePrimaryAssetAmount = (amount: string): IUpdatePrimaryAssetAmount => ({
  type: ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT,
  payload: parseInt(amount, 10),
});

interface IPayloadAsset {
  payload: IAssetMapped;
}

interface IUpdatePrimarySelectedAsset extends IPayloadAsset {
  type: ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET;
}

const updatePrimarySelectedAsset = (asset: IAssetMapped): IUpdatePrimarySelectedAsset => ({
  type: ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET,
  payload: asset,
});

interface IUpdateSecondarySelectedAsset extends IPayloadAsset {
  type: ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET;
}

const updateSecondarySelectedAsset = (asset: IAssetMapped): IUpdateSecondarySelectedAsset => ({
  type: ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET,
  payload: asset,
});

interface ILoadingUpdate {
  type: ActionTypes.LOADING;
  payload: boolean;
}

const loading = (isLoading: boolean): ILoadingUpdate => ({
  type: ActionTypes.LOADING,
  payload: isLoading,
});

interface ILoadingAssetsError {
  type: ActionTypes.ERROR_LOADING_ASSETS;
  payload: object;
}

const handleError = (error: object): ILoadingAssetsError => ({
  type: ActionTypes.ERROR_LOADING_ASSETS,
  payload: error,
});

// ---------------------------------------------------------------------------------------------
// ---------------------------- Async action creator  ------------------------------------------
// ---------------------------------------------------------------------------------------------

export async function getAssetsAPI(): Promise<any> {
  const requestUrl = `https://min-api.cryptocompare.com/data/all/coinlist`;

  const response = await fetch(requestUrl);

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error();
  }
}

export function fetchAssets(): (dispatch: Dispatch<IState>) => Promise<void> {
  return async (dispatch: Dispatch<IState>) => {
    dispatch(loading(true));

    try {
      const response = await getAssetsAPI();

      dispatch(assetsFetched(response));
    } catch (err) {
      dispatch(handleError(err));
    }
  };
}

// ---------------------------------------------------------------------------------------------
// ----------------------------         Reducer       ------------------------------------------
// ---------------------------------------------------------------------------------------------
export type IAssetMapped = {
  symbol: string;
  coinName: string;
  imageUrl: string;
};

interface IAssets {
  Data: object;
}

type IPrimaryAsset = {
  amount: number;
  asset: IAssetMapped;
};

type ISecondaryAsset = {
  asset: IAssetMapped;
};

export interface IState {
  assets: IAssets;
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: object;
}

const initialState = {
  assets: {
    Data: {},
  },
  primaryAsset: {
    amount: 0,
    asset: {
      symbol: '',
      coinName: '',
      imageUrl: '',
    },
  },
  secondaryAsset: {
    asset: {
      symbol: '',
      coinName: '',
      imageUrl: '',
    },
  },
  loading: false,
  error: {},
};

type Action = IAssetsFetched
  | ILoadingUpdate
  | ILoadingAssetsError
  | IUpdatePrimarySelectedAsset
  | IUpdatePrimaryAssetAmount
  | IUpdateSecondarySelectedAsset;

export const app: Reducer<IState> = (state: IState = initialState, action: Action): IState => {
  switch (action.type) {
    case ActionTypes.ALL_ASSETS_FETCHED:
      return {
        ...state,
        assets: {
          ...state.assets,
          ...action.payload,
        },
      };
    case ActionTypes.ERROR_LOADING_ASSETS:
      return {
        ...state,
        error: action.payload,
      };
    case ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET:
      return {
        ...state,
        primaryAsset: {
          ...state.primaryAsset,
          asset: action.payload,
        },
      };
    case ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET:
      return {
        ...state,
        secondaryAsset: {
          ...state.secondaryAsset,
          asset: action.payload,
        },
      };
    case ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT:
      return {
        ...state,
        primaryAsset: {
          ...state.secondaryAsset,
          amount: action.payload,
        },
      };
    case ActionTypes.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// ---------------------------------------------------------------------------------------------
// ----------------------------        Selectors      ------------------------------------------
// ---------------------------------------------------------------------------------------------

interface IAssets {
  Data: object;
}

const getAssets = (assets: any): IAssetMapped[] => {
  const allAssetsData = assets.Data;
  const assetsCode = Object.keys(allAssetsData);
  const assetsMaped: IAssetMapped[] = [];

  assetsCode.map((asset: string) => {
    assetsMaped.push({
      symbol: allAssetsData[asset].Symbol,
      coinName: allAssetsData[asset].CoinName,
      imageUrl: `${assets.BaseImageUrl}${allAssetsData[asset].ImageUrl}`,
    });
  });

  return assetsMaped;
};

export interface IMapStateToProps {
  assets: IAssetMapped[];
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: object;
}

export const mapStateToProps = (state: MainState): IMapStateToProps => {

  return {
    assets: getAssets(state.app.assets),
    primaryAsset: state.app.primaryAsset,
    secondaryAsset: state.app.secondaryAsset,
    loading: state.app.loading,
    error: state.app.error,
  };
};

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action bind creators  ------------------------------------------
// ---------------------------------------------------------------------------------------------

export const mapActionToDispatch = (dispatch: Dispatch<Action>) => {
  return bindActionCreators(
    {
      fetchAssets,
      updatePrimarySelectedAsset,
      updatePrimaryAssetAmount,
      updateSecondarySelectedAsset,
    },
    dispatch,
  );
};
