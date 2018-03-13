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
  readonly payload: object,
}

const assetsFetched = (assets: object): IAssetsUpdate => ({
  type: ActionTypes.ALL_ASSETS_FETCHED,
  payload: assets,
});

interface ILoadingUpdate {
  readonly type: ActionTypes.LOADING;
  readonly payload: boolean,
}

const loading = (isLoading: boolean): ILoadingUpdate => ({
  type: ActionTypes.LOADING,
  payload: isLoading,
});

interface ILoadingAssetsError {
  readonly type: ActionTypes.ERROR_LOADING_ASSETS;
  readonly payload: object,
}

const handleError = (error: object): ILoadingAssetsError => ({
  type: ActionTypes.ERROR_LOADING_ASSETS,
  payload: error,
});

// ---------------------------------------------------------------------------------------------
// ---------------------------- Async action creator  ------------------------------------------
// ---------------------------------------------------------------------------------------------


const fetchAssets = (): object => {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loading(true));
    return fetch(`https://min-api.cryptocompare.com/data/all/coinlist`)
      .then(json => dispatch(assetsFetched(json)))
      .catch(error => dispatch(handleError(error)));
  };
};

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
      debugger;

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
interface IAssets {
  Data: object;
}

const getAssetsCode = (assets: IAssets) => {
  return Object.keys(assets.Data);
};

const getAssets = (assets: IAssets) => {
  const assetsCode = getAssetsCode(assets);
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

export const mapActionToDispatch = (dispatch: Dispatch<IState>) => {
  return bindActionCreators({ fetchAssets }, dispatch);
};
