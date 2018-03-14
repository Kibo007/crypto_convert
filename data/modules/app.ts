import 'isomorphic-fetch';
import {bindActionCreators, Dispatch, Reducer} from 'redux';
import {MainState} from './../store';

// ---------------------------------------------------------------------------------------------
// ----------------------------     Action type     --------------------------------------------
// ---------------------------------------------------------------------------------------------

enum ActionTypes {
  ALL_ASSETS_FETCHED = 'ALL_ASSETS_FETCHED',
  UPDATE_PRIMARY_SELECTED_ASSET = 'UPDATE_PRIMARY_SELECTED_ASSET',
  UPDATE_PRIMARY_ASSET_AMOUNT = 'UPDATE_PRIMARY_ASSET_AMOUNT',
  UPDATE_SECONDARY_SELECTED_ASSET = 'UPDATE_SECONDARY_SELECTED_ASSET',
  UPDATE_ASSET_SEARCH = 'UPDATE_ASSET_SEARCH',
  ERROR_LOADING_ASSETS = 'ERROR_LOADING_ASSETS',
  LOADING = 'LOADING',
}

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------
interface IObject {
  payload: object;
}

interface IAssetsFetched extends IObject {
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

interface IAssetSearch {
  type: ActionTypes.UPDATE_ASSET_SEARCH;
  payload: string;
}

const updateAssetSearch = (search: string): IAssetSearch => ({
  type: ActionTypes.UPDATE_ASSET_SEARCH,
  payload: search,
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

export type IPrimaryAsset = {
  amount: number;
  asset: IAssetMapped;
};

type ISecondaryAsset = {
  asset: IAssetMapped;
};

export interface IState {
  assets: IAssets;
  assetSearch: string;
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: object;
}

const initialState = {
  assets: {
    Data: {},
  },
  assetSearch: '',
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
  | IAssetSearch
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
    case ActionTypes.UPDATE_ASSET_SEARCH:
      return {
        ...state,
        assetSearch: action.payload,
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
  assetSearch: string;
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: object;
}

export const sortByName = (a: string, b: string, direction: boolean): number => {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return direction ? -1 : 1;
  }
  if (nameA > nameB) {
    return direction ? 1 : -1;
  }

  // names must be equal
  return 0;
};

export const mapStateToProps = (state: MainState): IMapStateToProps => {
  const assets = getAssets(state.app.assets).filter((asset: IAssetMapped) => {

    if (state.app.assetSearch === '') {
      return asset;
    }

    const symbolIndex: number = asset.symbol
      .toLowerCase()
      .indexOf(state.app.assetSearch.toLowerCase());

    if (symbolIndex !== -1) {
      return asset;
    }
  }).sort((a, b) => {
    return sortByName(a.coinName, b.coinName, true);
  });

  return {
    assets,
    assetSearch: state.app.assetSearch,
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
      updateAssetSearch,
    },
    dispatch,
  );
};
