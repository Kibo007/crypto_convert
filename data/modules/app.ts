import 'isomorphic-fetch';
import { bindActionCreators } from 'redux';

// ---------------------------------------------------------------------------------------------
// ----------------------------     Action type     --------------------------------------------
// ---------------------------------------------------------------------------------------------

export const ADD_LOAD = 'app';

// ---------------------------------------------------------------------------------------------
// ---------------------------- Action creator  ------------------------------------------------
// ---------------------------------------------------------------------------------------------

const updateHeader = () => ({
  type: ADD_LOAD,
});

// ---------------------------------------------------------------------------------------------
// ---------------------------- Async action creator  ------------------------------------------
// ---------------------------------------------------------------------------------------------


const fetchBooks = (query, startIndex = 0) => {

  return dispatch => {
    dispatch(loading(true));
    return fetch(`https://min-api.cryptocompare.com/data/all/coinlist`)
      .then(checkStatus)
      .then(parseJSON)
      .then(json => dispatch(booksFetched(json, query)))
      .catch(error => dispatch(handleError(error)));
  };
};

// --------------------------
// Reducers
// --------------------------

const initialState = {
  load: '',
};

interface InitialState {
  load: string
}

interface IAction {
  type: string
  payload: string,
}

type Action = IAction;

export default (state: InitialState = initialState, action: Action) => {
  switch (action.type) {
    case ADD_LOAD:
      return {
        ...state,
        load: action.payload,
      };
    default:
      return state;
  }
};


// --------------------------
// Selectors
// --------------------------

export const mapStateToProps = (state: any) => {

  return {
    load: state.app.load,
  };
};

export const mapStateToDispatch = {};
