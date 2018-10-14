'use strict';
import React,{Component} from 'react';
import { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import storeFactory from './store/storeFactory';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom'
import { createBrowserHistory } from 'history';
import { createStore, combineReducers } from 'redux';
import { TableContainer} from './components/Containers';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { reducers } from './store/reducers';
import {sort,add,edit, remove } from './Actions';
import { hydrate } from 'react-dom';

let cart;
 if (typeof(window)!='undefined'){
cart=localStorage.getItem('cart');
cart?cart=JSON.parse(cart):cart=[];
 }
let initState=__INITIAL_STATE__;
initState['store']['cart']=cart;

const store = storeFactory(initState,false)

hydrate(
   <Provider store={store}>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </Provider>, 
    document.getElementById('app')
)