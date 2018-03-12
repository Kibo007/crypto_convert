import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from '../data/store';
import App from './containers/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider>
            <Route path="/" component={App}/>
          </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.querySelector('#root'),
);
