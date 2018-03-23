import {
  // Action creator
  assetsFetched,
  updatePrimaryAssetAmount,
  updateSecondaryAssetAmount,
  updatePrimarySelectedAsset,
  updateSecondarySelectedAsset,
  loading,
  handleError,
  updateAssetSearch,
  // Initial state
  initialState,
  // async action creators
  fetchAssets,
  fetchAssetsPrices,
  // reducer
  app as appReducer,
  // selectors
  mapStateToProps,
} from '../app';
import {
  ActionTypes, ErrorMessage, IAsset,
} from '../typeDefinition';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import assets from '../../fixtures/assets';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

jest.mock('../../helpers/api');
import api from '../../helpers/api';

describe('App module', () => {

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////                      App Actions Creator                 /////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('app module - Action creator', () => {
    const asset: IAsset = {
      symbol: 'ETN',
      coinName: 'Electroneum',
      imageUrl: 'some/url/etn.jpg',
    };

    it('should return action for assetsFetched', () => {
      const assetsPaylpad = { assets: [ 'ETN', 'BTC' ] };
      const newAction = assetsFetched(assetsPaylpad);
      const expectedAction = {
        type: ActionTypes.ALL_ASSETS_FETCHED,
        payload: assetsPaylpad,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for updatePrimaryAssetAmount', () => {
      const newAction = updatePrimaryAssetAmount('300');
      const expectedAction = {
        type: ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT,
        payload: 300,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for updateSecondaryAssetAmount', () => {
      const newAction = updateSecondaryAssetAmount(300);
      const expectedAction = {
        type: ActionTypes.UPDATE_SECONDARY_ASSET_AMOUNT,
        payload: 300,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for updatePrimarySelectedAsset', () => {
      const newAction = updatePrimarySelectedAsset(asset);
      const expectedAction = {
        type: ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET,
        payload: asset,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for updateSecondarySelectedAsset', () => {
      const newAction = updateSecondarySelectedAsset(asset);
      const expectedAction = {
        type: ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET,
        payload: asset,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for loading', () => {
      const newAction = loading(true);
      const expectedAction = {
        type: ActionTypes.LOADING,
        payload: true,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for handleError', () => {
      const errorMessage: ErrorMessage = {
        message: 'this asset is not available at moment',
      };
      const newAction = handleError(errorMessage);
      const expectedAction = {
        type: ActionTypes.ERROR_LOADING_ASSETS,
        payload: errorMessage,
      };
      expect(newAction).toEqual(expectedAction);
    });

    it('should return action for updateAssetSearch', () => {
      const newAction = updateAssetSearch('ETN');
      const expectedAction = {
        type: ActionTypes.UPDATE_ASSET_SEARCH,
        payload: 'ETN',
      };
      expect(newAction).toEqual(expectedAction);
    });
  });

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////                App Async Actions Creator                 /////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('app module - Async Action creator', () => {
    it('should fetch assets from cryptocompare api', async () => {
      api.setMockResponse(assets);

      const expectedActions = [
        { type: ActionTypes.LOADING, payload: true },
        { type: ActionTypes.ALL_ASSETS_FETCHED, payload: assets },
      ];

      const store = mockStore(initialState);
      await store.dispatch(fetchAssets());

      const actionsCreated = store.getActions();
      expect(actionsCreated).toEqual(expectedActions);
    });

    it('should fetch assets prices from cryptocompare api and update secondary amount', async () => {
      api.setMockResponse({ BTC: 0.001 });

      const expectedActions = [
        { type: ActionTypes.LOADING, payload: true },
        { type: ActionTypes.LOADING, payload: false },
        { type: ActionTypes.UPDATE_SECONDARY_ASSET_AMOUNT, payload: 1 },
      ];

      const stateWithAssets = {
        app: {
          primaryAsset: {
            amount: 1,
            asset: {
              symbol: 'ETN',
            },
          },
          secondaryAsset: {
            asset: {
              symbol: 'CAPP',
            },
          },
        },
      };

      const store = mockStore(stateWithAssets);
      await store.dispatch(fetchAssetsPrices());

      const actionsCreated = store.getActions();
      expect(actionsCreated).toEqual(expectedActions);
    });

    it('should fetch assets prices from cryptocompare api and update secondary amount', async () => {
      api.setMockResponse({ Response: 'Error', Message: 'This asset price is not available' });

      const expectedActions = [
        { type: ActionTypes.LOADING, payload: true },
        { type: ActionTypes.LOADING, payload: false },
        { type: ActionTypes.ERROR_LOADING_ASSETS, payload: { message: 'This asset price is not available' } },
      ];

      const stateWithAssets = {
        app: {
          primaryAsset: {
            amount: 1,
            asset: {
              symbol: 'XXX',
            },
          },
          secondaryAsset: {
            asset: {
              symbol: 'CAPP',
            },
          },
        },
      };

      const store = mockStore(stateWithAssets);
      await store.dispatch(fetchAssetsPrices());

      const actionsCreated = store.getActions();
      expect(actionsCreated).toEqual(expectedActions);
    });

  });

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////                         App Reducer                      /////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('app module - reducer', () => {
    const asset = {
      symbol: 'ETN',
      imageUrl: 'url/to/image.png',
      coinName: 'Electroneum',
    }
    it('should return initial state', () => {
      expect(appReducer(initialState, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle ALL_ASSETS_FETCHED', () => {
      const expectedState = {
        ...initialState,
        assets,
      };
      const updateState = appReducer(initialState, assetsFetched(assets));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle UPDATE_PRIMARY_ASSET_AMOUNT', () => {
      const expectedState = {
        ...initialState,
        primaryAsset: {
          ...initialState.primaryAsset,
          amount: 100,
        },
      };
      const updateState = appReducer(initialState, updatePrimaryAssetAmount('100'));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle UPDATE_SECONDARY_ASSET_AMOUNT', () => {
      const expectedState = {
        ...initialState,
        secondaryAsset: {
          ...initialState.secondaryAsset,
          amount: 100,
        },
      };
      const updateState = appReducer(initialState, updateSecondaryAssetAmount(100));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle UPDATE_PRIMARY_SELECTED_ASSET', () => {
      const expectedState = {
        ...initialState,
        primaryAsset: {
          ...initialState.primaryAsset,
          asset,
        },
      };
      const updateState = appReducer(initialState, updatePrimarySelectedAsset(asset));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle UPDATE_SECONDARY_SELECTED_ASSET', () => {
      const expectedState = {
        ...initialState,
        secondaryAsset: {
          ...initialState.secondaryAsset,
          asset,
        },
      };
      const updateState = appReducer(initialState, updateSecondarySelectedAsset(asset));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle LOADING', () => {
      const expectedState = {
        ...initialState,
        loading: true,
      };
      const updateState = appReducer(initialState, loading(true));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle ERROR_LOADING_ASSETS', () => {
      const expectedState = {
        ...initialState,
        error: {
          message: 'something  went wrong',
        },
      };
      const updateState = appReducer(initialState, handleError({ message: 'something  went wrong' }));
      expect(updateState).toEqual(expectedState);
    });

    it('should handle UPDATE_ASSET_SEARCH', () => {
      const expectedState = {
        ...initialState,
        assetSearch: 'ETN',
      };
      const updateState = appReducer(initialState, updateAssetSearch('ETN'));
      expect(updateState).toEqual(expectedState);
    });
  });

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////                         App Selector                      /////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////

});
