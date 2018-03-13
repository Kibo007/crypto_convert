import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import * as thunk from 'redux-thunk';
import createBrowserHistory from 'history/createBrowserHistory';
import * as promise from 'redux-promise';

import { IState as AppState, app } from './modules/app';

export interface MainState {
  app: AppState;
  router: any;
}

const rootReducer = combineReducers<MainState>({
  app,
  router: routerReducer,
});

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk.default,
  routerMiddleware(history),
  promise,
];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = (<any>window).devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
);

export default createStore(
  rootReducer,
  initialState,
  composedEnhancers,
);
