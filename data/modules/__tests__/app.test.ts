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

  });
});
