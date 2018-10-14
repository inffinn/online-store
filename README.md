This is test isomorphic internet magazine.

Short description:
Users can add products to cart. Cart save in local store.
To complete the order, user must pass the registratration. 
All purchases can be viewed in orders. User can edit personal information, change password.
For navigation used katalog menu, local and global search, sort, display selected filters.
On the server side encamp api interface, rendering, password encryption, checking and issuing tokens, data store.
For simplicity, instead of a database used a text file.
Administrator has extended interface, privilegies to read, edit, delete records in all dictionaries 
 (including  editing users, assign admin role). Admin login and password: admin admin
 
Used packages and tehnologies:
 React component, render, hydrade, connect, Redirect, BrowserRouter, Switch,
 Redux createStore, combineReducers, applyMiddleware, compose, actions, reducers,
 webpack, babel, express, selectors, cryptohash(password+salt), 
 scss, cookies, jwt autorisation, nodejs, localstore
 
 
to start project require node-server, npm and cmds(versions for stable):
npm install webpack@4.20.2 -g
npm install webpack-cli@3.1.2 -g
npm install babel-cli@6.26.0 -g

cmds in project directory to start it on node-server(8.12.0):
npm install
npm start

cmds in project directory to recompile project:
npm install
webpack

