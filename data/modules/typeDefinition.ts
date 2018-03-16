
// ---------------------------------------------------------------------------------------------
// ----------------------------     Action type     --------------------------------------------
// ---------------------------------------------------------------------------------------------

export enum ActionTypes {
  ALL_ASSETS_FETCHED = 'ALL_ASSETS_FETCHED',
  UPDATE_PRIMARY_SELECTED_ASSET = 'UPDATE_PRIMARY_SELECTED_ASSET',
  UPDATE_PRIMARY_ASSET_AMOUNT = 'UPDATE_PRIMARY_ASSET_AMOUNT',
  UPDATE_SECONDARY_ASSET_AMOUNT = 'UPDATE_SECONDARY_ASSET_AMOUNT',
  UPDATE_SECONDARY_SELECTED_ASSET = 'UPDATE_SECONDARY_SELECTED_ASSET',
  UPDATE_ASSET_SEARCH = 'UPDATE_ASSET_SEARCH',
  ERROR_LOADING_ASSETS = 'ERROR_LOADING_ASSETS',
  LOADING = 'LOADING',
}

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------

export interface IObject {
  payload: object;
}

export interface IAssetsFetched extends IObject {
  type: ActionTypes.ALL_ASSETS_FETCHED;
}

export interface IUpdatePrimaryAssetAmount {
  type: ActionTypes.UPDATE_PRIMARY_ASSET_AMOUNT;
  payload: number;
}


export interface IUpdateSecondaryAssetAmount {
  type: ActionTypes.UPDATE_SECONDARY_ASSET_AMOUNT;
  payload: number;
}


export interface IPayloadAsset {
  payload: IAsset;
}

export interface IUpdatePrimarySelectedAsset extends IPayloadAsset {
  type: ActionTypes.UPDATE_PRIMARY_SELECTED_ASSET;
}


export interface IUpdateSecondarySelectedAsset extends IPayloadAsset {
  type: ActionTypes.UPDATE_SECONDARY_SELECTED_ASSET;
}


export interface ILoadingUpdate {
  type: ActionTypes.LOADING;
  payload: boolean;
}

export interface ILoadingAssetsError {
  type: ActionTypes.ERROR_LOADING_ASSETS;
  payload: object;
}


export interface IAssetSearch {
  type: ActionTypes.UPDATE_ASSET_SEARCH;
  payload: string;
}


// ---------------------------------------------------------------------------------------------
// ----------------------------         Reducer       ------------------------------------------
// ---------------------------------------------------------------------------------------------\

export type IAsset = {
  symbol: string;
  coinName: string;
  imageUrl: string;
};

interface IAssets {
  Data: object;
}

export type IPrimaryAsset = {
  amount: number;
  asset: IAsset;
};

export type ISecondaryAsset = {
  amount: number;
  asset: IAsset;
};

export interface IState {
  assets: IAssets;
  assetSearch: string;
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: ErrorMessage;
}

export type Action = IAssetsFetched
  | IAssetSearch
  | ILoadingUpdate
  | ILoadingAssetsError
  | IUpdatePrimarySelectedAsset
  | IUpdatePrimaryAssetAmount
  | IUpdateSecondaryAssetAmount
  | IUpdateSecondarySelectedAsset;

// ---------------------------------------------------------------------------------------------
// ----------------------------        Selectors      ------------------------------------------
// ---------------------------------------------------------------------------------------------
export interface ErrorMessage {
  message: string;
}

export interface IMapStateToProps {
  assets: IAsset[];
  assetSearch: string;
  primaryAsset: IPrimaryAsset;
  secondaryAsset: ISecondaryAsset;
  loading: boolean;
  error: ErrorMessage;
}

export interface IMapDispatchToProps {
  fetchAssets(): () => Promise<void>;
  updatePrimarySelectedAsset(asset: IAsset): IUpdatePrimarySelectedAsset;
  updatePrimaryAssetAmount(value: string): IUpdatePrimaryAssetAmount;
  updateSecondarySelectedAsset(asset: IAsset): IUpdateSecondarySelectedAsset;
  updateAssetSearch(value: string): IAssetSearch;
  fetchAssetsPrices(): () => Promise<void>;
}
