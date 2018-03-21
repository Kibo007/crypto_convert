import 'isomorphic-fetch';
import { bindActionCreators, Dispatch, Reducer } from 'redux';
import { MainState } from './../store';
import {
  ActionTypes,
  IAssetsFetched,
  IUpdatePrimaryAssetAmount,
  IUpdateSecondaryAssetAmount,
  IUpdatePrimarySelectedAsset,
  IUpdateSecondarySelectedAsset,
  ILoadingUpdate,
  ILoadingAssetsError,
  IAssetSearch,
  IAsset,
  IState,
  Action,
  IMapStateToProps,
  ErrorMessage,
} from './typeDefinition';
import api from '../helpers/api';

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------

export const assetsFetched = (assets: object): IAssetsFetched => ({
  type: ActionTypes.ALL_ASSETS_FETCHED,
  payload: assets,
});

export const updatePrimaryAssetAmount = (amount: string): IUpdatePrimaryAssetAmount => ({
  type: ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT,
  payload: parseInt(amount, 10),
});

export const updateSecondaryAssetAmount = (amount: number): IUpdateSecondaryAssetAmount => ({
  type: ActionTypes.UPDATE_SECONDARY_ASSET_AMOUNT,
  payload: amount,
});

export const updatePrimarySelectedAsset = (asset: IAsset): IUpdatePrimarySelectedAsset => ({
  type: ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET,
  payload: asset,
});

export const updateSecondarySelectedAsset = (asset: IAsset): IUpdateSecondarySelectedAsset => ({
  type: ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET,
  payload: asset,
});

export const loading = (isLoading: boolean): ILoadingUpdate => ({
  type: ActionTypes.LOADING,
  payload: isLoading,
});

export const handleError = (error: ErrorMessage): ILoadingAssetsError => ({
  type: ActionTypes.ERROR_LOADING_ASSETS,
  payload: error,
});

export const updateAssetSearch = (search: string): IAssetSearch => ({
  type: ActionTypes.UPDATE_ASSET_SEARCH,
  payload: search,
});

// ---------------------------------------------------------------------------------------------
// ---------------------------- Async action creator  ------------------------------------------
// ---------------------------------------------------------------------------------------------

export function fetchAssets(): (dispatch: Dispatch<IState>) => Promise<any> {
  return async (dispatch: Dispatch<IState>) => {
    dispatch(loading(true));

    try {
      const response = await api.get(`https://min-api.cryptocompare.com/data/all/coinlist`);
      dispatch(assetsFetched(response));
    } catch (err) {
      dispatch(handleError(err));
    }
  };
}

export function fetchAssetsPrices(): (dispatch: Dispatch<IState>, getState: () => MainState) => Promise<void> {
  return async (dispatch: Dispatch<IState>, getState: () => MainState) => {
    dispatch(loading(true));

    const state: MainState = getState();
    const primaryAssetAmount: number = state.app.primaryAsset.amount;
    const primaryAssetSymbol: string = state.app.primaryAsset.asset.symbol;
    const secondaryAssetSymbol: string = state.app.secondaryAsset.asset.symbol;
    const primaryAssetURL = `https://min-api.cryptocompare.com/data/price?fsym=${primaryAssetSymbol}&tsyms=BTC`;
    const secondaryAssetURL = `https://min-api.cryptocompare.com/data/price?fsym=${secondaryAssetSymbol}&tsyms=BTC`;

    type APIResponse = { BTC?: number; Response?: string; Message?: string; };

    try {
      const primaryAssetPrice: APIResponse = await api.get(primaryAssetURL);
      const secondaryAssetPrice: APIResponse = await api.get(secondaryAssetURL);
      dispatch(loading(false));

      if (primaryAssetPrice.Response === 'Error') {
        dispatch(handleError({ message: primaryAssetPrice.Message }));
      } else if (secondaryAssetPrice.Response === 'Error') {
        dispatch(handleError({ message: secondaryAssetPrice.Message }));
      } else {
        const secondaryAssetAmount: number = (primaryAssetAmount * primaryAssetPrice.BTC) / secondaryAssetPrice.BTC;
        dispatch(updateSecondaryAssetAmount(secondaryAssetAmount));
      }

    } catch (err) {
      dispatch(handleError(err));
    }
  };
}

// ---------------------------------------------------------------------------------------------
// ----------------------------         Reducer       ------------------------------------------
// ---------------------------------------------------------------------------------------------\

export const initialState: IState = {
  assets: {
    Data: {},
  },
  assetSearch: '',
  primaryAsset: {
    amount: 1,
    asset: {
      symbol: '',
      coinName: '',
      imageUrl: '',
    },
  },
  secondaryAsset: {
    amount: null,
    asset: {
      symbol: '',
      coinName: '',
      imageUrl: '',
    },
  },
  loading: false,
  error: {
    message: '',
  },
};

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
        error: {
          ...state.error,
          ...action.payload,
        },
      };
    case ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET:
      return {
        ...state,
        primaryAsset: {
          ...state.primaryAsset,
          asset: action.payload,
        },
        assetSearch: '',
      };
    case ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET:
      return {
        ...state,
        secondaryAsset: {
          ...state.secondaryAsset,
          asset: action.payload,
        },
        assetSearch: '',
      };
    case ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT:
      return {
        ...state,
        primaryAsset: {
          ...state.primaryAsset,
          amount: action.payload,
        },
      };
    case ActionTypes.UPDATE_SECONDARY_ASSET_AMOUNT:
      return {
        ...state,
        secondaryAsset: {
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

const getAssets = (assets: any): IAsset[] => {
  const allAssetsData = assets.Data;
  const assetsCode = Object.keys(allAssetsData);
  const assetsMaped: IAsset[] = [];

  assetsCode.map((asset: string) => {
    assetsMaped.push({
      symbol: allAssetsData[ asset ].Symbol,
      coinName: allAssetsData[ asset ].CoinName,
      imageUrl: `${assets.BaseImageUrl}${allAssetsData[ asset ].ImageUrl}`,
    });
  });

  return assetsMaped;
};

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
  const assets = getAssets(state.app.assets).filter((asset: IAsset) => {

    if (state.app.assetSearch === '') {
      return asset;
    }

    return asset.symbol
      .toLowerCase()
      .match(state.app.assetSearch.toLowerCase());

  }).sort((a, b) => {
    return sortByName(a.coinName, b.coinName, true);
  });

  return {
    assets,
    assetSearch: state.app.assetSearch,
    primaryAsset: state.app.primaryAsset,
    secondaryAsset: state.app.secondaryAsset,
    loading: state.app.loading,
    error: {
      message: state.app.error.message,
    },
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
      fetchAssetsPrices,
    },
    dispatch,
  );
};
