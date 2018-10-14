import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import fs from 'fs'
import { Provider } from 'react-redux'
import { compose } from 'redux'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import api from './api'
import App from '../components/App'
import storeFactory from '../store/storefactory'
import initialState from '../../data/initialState.json';
import schema from '../../data/schema.json';
import {login} from '../Actions';
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
var favicon = require('serve-favicon');
const staticCSS = fs.readFileSync(path.join(__dirname, '../../dist/assets/main.css'))
const fileAssets = express.static(path.join(__dirname, '../../dist/assets'))


const serverStore = storeFactory(initialState, true)

serverStore.subscribe(() =>
    fs.writeFileSync(
            path.join(__dirname, '../../data/initialState.json'),
            JSON.stringify(serverStore.getState()),
            error => (error) ? console.log("Error saving state!", error) : null
    )
)

const buildHTMLPage = ({html, state, css}) => `
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, user-scalable=yes" />
        <meta charset="utf-8">
        <title>Magazine</title>
<style>${staticCSS}</style>
    </head>
    <body>
        <div id="app">${html}</div>
        <script>
     window.__INITIAL_STATE__ = ${JSON.stringify(state)}
</script> 
<script src="/bundle.js"> </script>
    </body>
</html>
`
//<script src="/bundle.js"></script>
//  //    window.__INITIAL_STATE__ = ${JSON.stringify(state)}
//<meta name="viewport" content="minimum-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=yes" />
// </script>        <script src="/bundle.js"></script>
const renderComponentsToHTML = ({url, req}) => {
    let id, username, role;
    const token = req.cookies['token'];
    const secret = new Buffer('CLIENT_SECRET', 'base64')
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return;
            }
            id = decoded.id
            username = decoded.username;
            role = decoded.role;
        }
        )
    }
    let globalState = serverStore.getState();
    let userInitialState = {store: {}};
    Object.keys(globalState['store']).map(key => {
        if (key != 'user' && key != 'order' && key != 'user_order')
            userInitialState['store'][key] = globalState['store'][key];
    })
    let order = [];
    let user_order = [];
    let users = [];
    let find_user = globalState['store']['user'].find(user_row => id == user_row['id']);
    if (find_user) {
        if (role == 'user') {
            let user_ = {};
            schema['user'].map(key => {
                user_[key['id']] = find_user[key['id']]
            });
            users[0] = user_;
            order = globalState['store']['order'].filter(row => find_user.id == row.user);
            order.map(order_row => globalState['store']['user_order'].map(
                        user_order_row => {
                            if (order_row.id == user_order_row.order)
                                user_order.push(user_order_row)
                        }))

        }
        if (find_user.role == 'admin') {
            order = globalState['store']['order'];
            user_order = globalState['store']['user_order'];
            users = globalState['store']['user'].map(user_row => {
                let user_ = {};
                schema['user'].map(key => (user_[key['id']] = user_row[key['id']]))
                return user_;
            })
        }

        userInitialState['store']['order'] = order;
        userInitialState['store']['user_order'] = user_order;
        userInitialState['store']['user'] = users;

    }
    let user_store = storeFactory(userInitialState, true);
    if (find_user)
        user_store.dispatch({type: 'LOGIN', id:find_user.id, username:find_user.username, role:find_user.role})
    let state = user_store.getState();
    return ({
        state: state,
        html: renderToString(
                   <Provider store={user_store}>
                 <StaticRouter location={url} context={{}}>
                 <App/>
                 </StaticRouter>
                 </Provider>
                )
    })
}



const htmlResponse = compose(
        buildHTMLPage,
        renderComponentsToHTML
        )

const respond = (req, res, next) => {
    console.log('buildHTMLPage')
    return (res.status(200).send(
            htmlResponse({url: req.url, req: req, res: res, next: next}))
            )
}

const logger = (req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`)
    next()
}

const addStoreToRequestPipeline = (req, res, next) => {
    req.store = serverStore
    next()
}




export default express()
        .use(bodyParser.json())
        .use(cookieParser('keyboard cat'))
        .use(logger)
        .use(favicon(path.join(__dirname, '../../dist/assets/img/logo/cart.png')))
        .use(fileAssets)
        .use(addStoreToRequestPipeline)
        .use('/api', api)
        .use(respond)
