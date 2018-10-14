'use strict';
import css from '../../css/app.scss';
import Logo from '../../css/components/Logo.scss';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import  Registration from './ui/Registration';
import { render } from 'react-dom';
import { Redirect,Route, Switch } from 'react-router-dom';
import {add,edit,remove} from '../Actions'
import consts from '../constants';
import {
    Table_Container,
    Registration_Form_Container,
    Login_Form_Container, 
    Table_Panel_Container,
    Page_Container,
    Katalog_Navigator_Container,
    Cart_Total_Container,
    Message_List_Container,
    Entity_List_Container,
    Entity_Item_Container,
    Order_Container
} from './Containers';
import Error404 from './ui/Error404';
import Menu from './ui/Menu';
import Katalog_Menu from './ui/Katalog_Menu';



const ErrorPage=()=>(Error404(`Cannot find resource at ${location.pathname}`));
const App = () =>{
return(
    
    <div className="App">
    <Switch>
   <Redirect exact from="/" to="/product"/>
   <Route exact path="/:entity/:id" component={Entity_Item_Container}/>
   <Route exact path="/:entity/:id/:command" component={Entity_Item_Container}/>  
   <Route  exact path="/registration" component={Registration}/> 
      <Route exact path="/view_order" component={Order_Container}/>
    <Route exact path="/:entity" component={Entity_List_Container}/>
 

 
   <Route component={ErrorPage} />
 </Switch>
 </div>
 )}
export default App
