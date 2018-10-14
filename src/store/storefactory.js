import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import {store, sort, search, current_user } from './reducers';
import stateData from '../../data/initialState';
import {composeWithDevTools} from 'redux-devtools-extension';
var ReduxThunk = require('redux-thunk').default;
import { createBrowserHistory } from 'history';

const logger = store => next => action => {
            let result
            console.groupCollapsed("dispatching", action.type)
            let prev_state = store.getState();
            console.log('prev state', prev_state)
            console.log('action', action)
            result = next(action)
            let next_state = store.getState();
            console.log('next state', next_state)
            console.groupEnd()
            return result
        }

const saver = store => next => action => {
            let result = next(action)
            localStorage['redux-store'] = JSON.stringify(store.getState())
            return result
        }

const storeFactory = (initData, server = false) => {
    if (server === true)
        return new createStore((combineReducers({store, sort, search, current_user})), initData, applyMiddleware(logger, ReduxThunk))
    else {

        return  (
                createStore(
                        combineReducers({store, sort, search, current_user}),
                        initData,
                        compose(
                                applyMiddleware(saver, logger, ReduxThunk),
                                window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
                        )
                        )
                )
}
}
export default storeFactory;