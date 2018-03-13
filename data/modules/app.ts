import 'isomorphic-fetch';
import { bindActionCreators, Dispatch, Reducer } from 'redux';
import { MainState } from './../store';

// ---------------------------------------------------------------------------------------------
// ----------------------------     Action type     --------------------------------------------
// ---------------------------------------------------------------------------------------------

enum ActionTypes {
  ALL_ASSETS_FETCHED = 'ALL_ASSETS_FETCHED',
  ERROR_LOADING_ASSETS = 'ERROR_LOADING_ASSETS',
  LOADING = 'LOADING',
}

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------
interface IAssetsUpdate {
  readonly type: ActionTypes.ALL_ASSETS_FETCHED;
  readonly payload: object;
}

const assetsFetched = (assets: object): IAssetsUpdate => ({
  type: ActionTypes.ALL_ASSETS_FETCHED,
  payload: assets,
});

interface ILoadingUpdate {
  readonly type: ActionTypes.LOADING;
  readonly payload: boolean;
}

const loading = (isLoading: boolean): ILoadingUpdate => ({
  type: ActionTypes.LOADING,
  payload: isLoading,
});

interface ILoadingAssetsError {
  readonly type: ActionTypes.ERROR_LOADING_ASSETS;
  readonly payload: object;
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

const initialState = {
  assets: {
    Data: {},
  },
  loading: false,
  error: {},
};

interface IAssets {
  Data: object;
}

export interface IState {
  assets: IAssets,
  loading: boolean,
  error: object,
}

type Action = IAssetsUpdate | ILoadingUpdate | ILoadingAssetsError;

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

interface IData {
  [index: string] : string;
}

interface IAssets {
  Data: object;
}

export interface IAssetsMapped {
  symbol: string;
  coinName: string;
  imageUrl: string;
}

const getAssets = (assets: any): IAssetsMapped[] => {
  const allAssetsData = assets.Data;
  const assetsCode = Object.keys(allAssetsData);
  const assetsMaped: IAssetsMapped[] = [];

  assetsCode.map((asset: string) => {
    assetsMaped.push({
      symbol: allAssetsData[asset].Symbol,
      coinName: allAssetsData[asset].CoinName,
      imageUrl: `${assets.BaseImageUrl}${allAssetsData[asset].ImageUrl}`,
    });
  });

  return assetsMaped;
};

export const mapStateToProps = (state: MainState): object => {

  return {
    assets: getAssets(state.app.assets),
    loading: state.app.loading,
    error: state.app.error,
  };
};

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action bind creators  ------------------------------------------
// ---------------------------------------------------------------------------------------------

export const mapActionToDispatch = (dispatch: Dispatch<any>) => {
  return bindActionCreators({ fetchAssets }, dispatch);
};
