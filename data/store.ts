import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {routerMiddleware, routerReducer} from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

import { IState as AppState, app } from './modules/app';

export interface MainState {
  app: AppState;
  router: any;
}

const rootReducer = combineReducers<MainState>({
  app,
  router: routerReducer,
});

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware(history),
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
